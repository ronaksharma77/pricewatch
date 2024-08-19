import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { fetchProductDetails } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { PriceHistoryItem } from "@/types";
import { connect } from "http2";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();
        const products = await Product.find();
        if(!products) throw new Error("products not found");

        const updatedProducts = await Promise.all(
            products.map(async (curProduct)=>{
                const scrapedProduct = await fetchProductDetails(curProduct.url);
                if(!scrapedProduct) throw new Error("scraped product not found");

                const updatedPriceHistory = [
                    ...curProduct.priceHistory,
                    { date: Date.now(), price: scrapedProduct.currentPrice }
                ]
            //redeclaration to update the product in DB
                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory.map((price) => ({
                        price: price.price,
                    })) as PriceHistoryItem[],
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                }
                  const updatedProduct = await Product.findOneAndUpdate(
                    { url: scrapedProduct.url },
                   product,
                  );
              //send email notification if price lowered and or is in stock
        const emailNotifType = getEmailNotifType(
            scrapedProduct,
            curProduct
          );
  
          if (emailNotifType && updatedProduct.users.length > 0) {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.url,
              image: updatedProduct.image,
            };
            // mail content
            const emailContent = await generateEmailBody(productInfo, emailNotifType);
            // list of users registered to receive notifications 
            const userEmails = updatedProduct.users.map((user: any) => user.email);
            // Send mail
            await sendEmail(emailContent, userEmails);
          }
  
          return updatedProduct;
        })
      );
  
      return NextResponse.json({
        message: "Ok",
        data: updatedProducts,
      });
    } catch (error: any) {
      throw new Error(`Failed to get all products: ${error.message}`);
    }
  }