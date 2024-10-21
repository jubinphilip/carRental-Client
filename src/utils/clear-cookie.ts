//function for clearing the cookie which stores the token
 export function clearCookie(name: string) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}


