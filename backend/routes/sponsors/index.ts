import {
  getSponsorDetail,
  getSponsors,
  getSponsorByAdminEmail,
  getHackersByAdminEmail,
} from "./sponsor_list";
import { createSponsor } from "./sponsor_create";
import { updateSponsor } from "./sponsor_update";
import { createAdmin } from "./admin_create";
import { addHackerToSponsor } from "./hacker";

export {
  getSponsorDetail,
  getSponsors,
  addHackerToSponsor,
  getSponsorByAdminEmail,
  getHackersByAdminEmail,
  createSponsor,
  updateSponsor,
  createAdmin,
};
