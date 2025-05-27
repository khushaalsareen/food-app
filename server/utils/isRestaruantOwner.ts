export const isRestarantOwner = (email: string): boolean => {
    // format -> abc.res123@nitj.ac.in 
    const regex = /^[a-zA-Z]+\.res\.\d+@nitj\.ac\.in$/;
    return regex.test(email);
}