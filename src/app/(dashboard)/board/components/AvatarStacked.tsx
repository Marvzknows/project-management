import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from "@/components/ui/shadcn-io/avatar-group";
import { BoardUsersT } from "@/types/board";

type Props = {
  users: BoardUsersT[];
};
export const AvatarStacked = ({ users }: Props) => {
  return (
    <div className="border-2 p-0.5 rounded-full">
      <div className="p-1.5 rounded-full">
        <AvatarGroup
          variant="css"
          invertOverlap
          tooltipProps={{ side: "bottom", sideOffset: 12 }}
        >
          {users.map((avatar) => (
            <Avatar key={avatar.id}>
              <AvatarImage src={avatar.image} />
              <AvatarFallback>{avatar.name}</AvatarFallback>
              <AvatarGroupTooltip>
                <p>{avatar.name}</p>
              </AvatarGroupTooltip>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
};
export default AvatarStacked;
