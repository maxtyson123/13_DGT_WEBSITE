interface CacheItem {
    expiry_date: Date,
    data: any
}

export function getFromCache(id: string){

    let item = null;
    item = localStorage.getItem(id);

    // Check if the item exists in the local storage
    if(item){

        // Convert into JSON
        item = JSON.parse(item as string) as CacheItem;

        // Check if the item has expired
        if(new Date(item.expiry_date) < new Date()){

            console.log("Cache item [" + id + "] has expired");

            // If it has expired, remove it from the local storage
            localStorage.removeItem(id);

            // Return null
            return null;
        }

        return item.data;
    }

    return item;


}

export function saveToCache(id: string, data: any){

    // Create the cache item
    const cacheItem: CacheItem = {
        expiry_date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 24 hours
        data: data
    }

    // Save the cache item to the local storage
    localStorage.setItem(id, JSON.stringify(cacheItem));

}

export function clearCache(){
    localStorage.clear();
}