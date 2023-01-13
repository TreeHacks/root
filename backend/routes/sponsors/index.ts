import {
  getSponsorDetail,
  getSponsors,
  getSponsorByAdminEmail,
  getHackersByAdminEmail,
} from "./sponsor_list";
import { createSponsor } from "./sponsor_create";
import { updateSponsor } from "./sponsor_update";
import { createAdmin } from "./admin_create";
import { addHackerToSponsor, removeHackerFromSponsor } from "./hacker";

export {
  getSponsorDetail,
  getSponsors,
  addHackerToSponsor,
  removeHackerFromSponsor,
  getSponsorByAdminEmail,
  getHackersByAdminEmail,
  createSponsor,
  updateSponsor,
  createAdmin,
};
