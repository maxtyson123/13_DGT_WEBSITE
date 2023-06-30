interface CacheItem {
    expiry_date: Date,
    data: any
}

/**
 *  Will try to get an item from the localstorage, if the item is expired, it will be removed from the local storage
 *
 * @param {string} id - The key used to store the item in the local storage
 *
 * @see {@link CacheItem}
 *
 * @returns {JSON | null} - The item from the local storage, or null if the item does not exist or has expired
 */
export function getFromCache(id: string){

    let item = localStorage.getItem(id);

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

/**
 * Saves an item to the local storage, gives it an expiry date of 24 hours from now
 *
 * @param {string} id - The key used to store the item in the local storage
 * @param {JSON} data - The data to store in the local storage, will be converted to JSON
 *
 * @see {@link CacheItem}
 */
export function saveToCache(id: string, data: any){

    // Create the cache item
    const cacheItem: CacheItem = {
        expiry_date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 24 hours
        data: data
    }

    // Save the cache item to the local storage
    localStorage.setItem(id, JSON.stringify(cacheItem));

}