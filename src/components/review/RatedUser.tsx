import { RatedUserDto } from "@/dto/review/RatedUserDto";
import { Rating, Stack, Typography } from "@mui/material";

export const RatedUser = ({ ratedUserDto }: { ratedUserDto: RatedUserDto }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography>{ratedUserDto.userName + "さん"}</Typography>
      <Rating disabled={ratedUserDto.reviewCount == 0} size="small" defaultValue={ratedUserDto.averageScore} precision={0.5} readOnly />
      <Typography>({ratedUserDto.reviewCount})</Typography>
    </Stack>
  );
}
