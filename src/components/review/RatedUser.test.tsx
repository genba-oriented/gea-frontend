import { RatedUserDto } from "@/dto/review/RatedUserDto";
import { setupRtl } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";
import { RatedUser } from "./RatedUser";

setupRtl();

test("show rated user name", async () => {

  const ratedUserDto = new RatedUserDto();
  ratedUserDto.averageScore = 4.5;
  ratedUserDto.reviewCount = 5;
  ratedUserDto.userId = "u01";
  ratedUserDto.userName = "uname01";

  render(
    <RatedUser ratedUserDto={ratedUserDto} />

  );
  await waitFor(() => {
    expect(screen.getByText("uname01さん")).toBeVisible();
  });


});