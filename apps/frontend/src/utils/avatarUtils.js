import efBluePfp from "../assets/team/ef-blue-pfp.svg";
import efGoldPfp from "../assets/team/ef-gold-pfp.svg";
import efRedPfp from "../assets/team/ef-red-pfp.svg";
import itachiPfp from "../assets/team/itachi-pfp.svg";
import golemPfp from "../assets/team/golem-pfp.svg";

const avatarMap = {
  "ef-blue-pfp.svg": efBluePfp,
  "ef-gold-pfp.svg": efGoldPfp,
  "ef-red-pfp.svg": efRedPfp,
  "itachi-pfp.svg": itachiPfp,
  "golem-pfp.svg": golemPfp,
};

export const getAvatar = (avatarFileName) => {
    return avatarMap[avatarFileName] ?? efBluePfp;
  };
