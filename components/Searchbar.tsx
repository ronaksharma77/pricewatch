"use client";
import { scrapeAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, use } from 'react'
import { useState } from 'react'; 

const isValidProductUrl = (url:string) => {
  try{
     const parsedUrl = new URL(url);
     const hostname = parsedUrl.hostname;
     if(hostname.includes('amazon') ||
     hostname.includes('flipkart')){
       return true;   
     }
     else return false;
  }
  catch(e){
    return false;
  }
}

const Searchbar = () => {
  const[searchPrompt,setSearchPrompt] = useState('');
  const [isLoading,setIsLoading] =useState(false);
  const handleSubmit = async (event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const isValidUrl = isValidProductUrl(searchPrompt);
    if(!isValidUrl){
      alert('Please enter a valid URL');
      return;
    }
    try{
      setIsLoading(true);
      // fetch product details
      const product = await scrapeAndStoreProduct(searchPrompt);
      console.log(product);
    }
    catch(e){
      console.log("product not fetched");
      console.error(e);
    }
    finally{
      setIsLoading(false);
    }
  }
  return (
    <div>
      <form className="flex flex-wrap gap-15 mt-12 gap-x-1" onSubmit={handleSubmit}>
      <input type="text" 
      value={searchPrompt}
      onChange={(e)=>setSearchPrompt(e.target.value)}
      placeholder="Paste the product URL here" className="searchbar-input"/>
      <button disabled = {searchPrompt===''}  type="submit" className="searchbar-btn">
 {isLoading ? 'Loading...' : 'Track Price'}
</button>

        </form>
    </div>
  )
}

export default Searchbar
