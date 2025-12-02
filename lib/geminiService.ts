const SANTA_MESSAGES = [
    "Ho ho ho! You were faster than Rudolph on Christmas Eve! That was some spectacular flying through the snow.",
    "Amazing run! The elves back at the workshop are cheering for you. I haven't seen moves like that since 1994!",
    "Nice try! The winter winds were strong today, but you handled the sleigh beautifully. Keep practicing for the big night!",
    "Spectacular! You dodged those snowmen like a true professional. You are definitely on the Nice List this year!",
    "Oh my! That was a close call with the ice patches! Grab some hot cocoa and warm up for your next attempt.",
    "Incredible speed! Blitzen would be jealous of how fast you collected those gifts. Merry Christmas!",
    "Great effort! A few more cookies for energy and you might just beat the high score next time. Good luck!",
    "The North Pole is buzzing about your performance! You have the spirit of Christmas in your heart and your flying skills.",
    "Merry Christmas! You brought joy to the world with that run. Even Mrs. Claus was impressed by your agility!",
    "You are a natural gift gatherer! The reindeer are asking if you want to join the team this year. Great job!"
];

export const getSantaMessage = (name: string, score: number): string => {
    const randomIndex = Math.floor(Math.random() * SANTA_MESSAGES.length);
    return SANTA_MESSAGES[randomIndex];
};