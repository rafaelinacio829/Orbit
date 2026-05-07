import { DashboardScreen } from "../../components/dashboard-screen";
import { requireUser } from "../../lib/auth";
import { getDashboardPayload } from "../../lib/server-data";

export default async function DashboardRoutePage() {
  const user = await requireUser();
  const data = await getDashboardPayload(user.id);

  return <DashboardScreen data={data} />;
}
