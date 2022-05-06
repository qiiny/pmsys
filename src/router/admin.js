import Welcome from "../components/Welcome";
import UserList from "../components/admin/owner/UserList";
import OwnerList from "../components/admin/House/OwnerList";
import FeeWater from "../components/admin/Fee/FeeWater";
import FeePower from "../components/admin/Fee/FeePower";
import FeePropert from "../components/admin/Fee/FeePropert";
import HouseList from "../components/admin/House/HouseList";
import PowerRepai from "../components/admin/Repai/powerRepai";
import WaterRepai from "../components/admin/Repai/WaterRepai";
import Site from "../components/admin/Repai/Site";
import Notice from "../components/admin/Community/Notice";
import MessageBoa from "../components/admin/Community/MessageBoa";
import Complaint from "../components/admin/Community/Complaint";
import Staff from "../components/admin/owner/Staff";
export default [
    {path:"/welcome",component:Welcome},
    {path: "/user",component: UserList},
    {path: "/ownerList",component: OwnerList},
    {path: "/feeWater",component: FeeWater},
    {path: "/feePower",component: FeePower},
    {path: "/feePropert",component: FeePropert},
    {path: "/houseList",component: HouseList},
    {path: "/powerRepai",component: PowerRepai},
    {path: "/waterRepai",component: WaterRepai},
    {path: "/site",component: Site},
    {path: "/notice",component: Notice},
    {path: "/MessageBoa",component: MessageBoa},
    {path: "/complaint",component: Complaint},
    {path: "/staff",component: Staff}
]


