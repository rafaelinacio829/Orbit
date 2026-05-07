import { SettingsScreen } from "../../components/settings-screen";
import { requireUser } from "../../lib/auth";
import { getSettingsPayload } from "../../lib/server-data";

export default async function SettingsPage() {
  const user = await requireUser();
  const data = await getSettingsPayload(user.id);

  return <SettingsScreen data={data} />;
}
