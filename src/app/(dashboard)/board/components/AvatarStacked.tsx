import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from "@/components/ui/shadcn-io/avatar-group";

const AVATARS = [
  {
    src: "https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg",
    fallback: "SK",
    tooltip: "Skyleen",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    fallback: "CN",
    tooltip: "Shadcn",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    fallback: "AW",
    tooltip: "Adam Wathan",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
    fallback: "GR",
    tooltip: "Guillermo Rauch",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg",
    fallback: "JH",
    tooltip: "Jhey",
  },
];

export const AvatarStacked = () => {
  return (
    <div className="border-2 p-0.5 rounded-full">
      <div className="p-1.5 rounded-full">
        <AvatarGroup
          variant="css"
          invertOverlap
          tooltipProps={{ side: "bottom", sideOffset: 12 }}
        >
          {AVATARS.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
              <AvatarGroupTooltip>
                <p>{avatar.tooltip}</p>
              </AvatarGroupTooltip>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
};
export default AvatarStacked;
