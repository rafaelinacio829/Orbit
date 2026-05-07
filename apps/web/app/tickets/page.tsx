import { TicketsScreen } from "../../components/tickets-screen";
import { requireUser } from "../../lib/auth";
import { getDashboardPayload } from "../../lib/server-data";

export default async function TicketsPage() {
  const user = await requireUser();
  const data = await getDashboardPayload(user.id);

  return <TicketsScreen data={data} />;
}
