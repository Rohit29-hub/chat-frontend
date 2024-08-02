export const getAvatars = () => {
    const avatarImg = [];
    for(let i = 1; i<=6; i++){
        const res = `https://api.multiavatar.com/${Math.floor(Math.random() * 100) + 1}.png?apikey=aK6n28ZBPsfyvg`;
        avatarImg.push(res);
    }
    return avatarImg;
}