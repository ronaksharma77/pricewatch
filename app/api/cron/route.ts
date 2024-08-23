import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { fetchProductDetails } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();
        const products = await Product.find();
        if (!products || products.length === 0) throw new Error("No products found");

        const updatedProducts = await Promise.all(
            products.map(async (curProduct) => {
                const scrapedProduct = await fetchProductDetails(curProduct.url);
                
                if (!scrapedProduct) {
                    console.warn(`Scraped product not found for URL: ${curProduct.url}`);
                    return null;
                }

                if (!scrapedProduct.currentPrice) {
                    console.warn(`Current price not found for scraped product: ${curProduct.url}`);
                    return null;
                }

                const updatedPriceHistory = [
                    ...curProduct.priceHistory,
                    { date: Date.now(), price: scrapedProduct.currentPrice }
                ];

                // Redeclaration to update the product in DB
                const productData = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory.map((price) => ({
                        price: price.price,
                        date: price.date || Date.now(), // Ensure date is always present
                    })),
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                };

                const updatedProduct = await Product.findOneAndUpdate(
                    { url: scrapedProduct.url },
                    productData,
                    { new: true }
                );

                if (!updatedProduct) {
                    console.warn(`Product not updated for URL: ${scrapedProduct.url}`);
                    return null;
                }

                // Send email notification if price lowered and/or is in stock
                const emailNotifType = getEmailNotifType(scrapedProduct, curProduct);

                if (emailNotifType && updatedProduct.users.length > 0) {
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url,
                        image: updatedProduct.image,
                    };
                    const emailContent = await generateEmailBody(productInfo, emailNotifType);
                    const userEmails = updatedProduct.users.map((user: any) => user.email);
                    await sendEmail(emailContent, userEmails);
                }
                return updatedProduct;
            })
        );

        return NextResponse.json({
            message: "Ok",
            updatedProducts
        });
    } catch (error: any) {
        console.error(`Error during GET /api/cron: ${error.message}`);
        throw new Error(`Failed to get all products: ${error.message}`);
    }
}