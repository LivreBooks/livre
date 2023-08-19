async function hasValidSsl(domain: string) {
    try {
        const response = await fetch(`https://${domain}`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export default hasValidSsl;
