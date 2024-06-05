import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { notification } from "@/types/notification"
import Link from "next/link"

export type Alert = {
    id: string
    title: string
    status: "critical" | "normal"
    feed: string
    timestamp : string
  }
export function NotificationTab({rows, feeds, pushFeed, popFeed}:{rows:notification[];feeds: notification[] ;pushFeed: (feed:notification)=> void; popFeed: (feed:notification)=> void;}){
    const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

    const toggleAlertSelection = (id: string) => {
        if (selectedAlerts.includes(id)) {
        setSelectedAlerts(selectedAlerts.filter(alertId => alertId !== id));
        } else {
        setSelectedAlerts([...selectedAlerts, id]);
        }
    };
    return (
        <table className="min-w-full divide-y divide-gray-200">
      {/* <thead>
        <tr>
          <th className="py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span></span>
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Feed
          </th>
          <th className="px-6 py-3 text-right bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Time
          </th>
        </tr>
      </thead> */}
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.map(alert => (
          <Row key={alert.id} pushFeed={pushFeed} popFeed={popFeed} feeds={feeds} alert={alert} />
        ))}
      </tbody>
    </table>
    )
}
function Row({alert, feeds, pushFeed, popFeed}:{alert:notification; feeds: notification[];pushFeed: (feed:notification)=> void; popFeed: (feed:notification)=> void;}){
    const dt = alert.timeStamp;
    return  (
        <tr key={alert.id}>
            <td className="py-4 whitespace-no-wrap">
              <Checkbox className="m-1" checked={feeds.includes(alert)}
                  onCheckedChange={(val:boolean)=>val?pushFeed(alert):popFeed(alert)}
                />
            </td>
            <td className="px-1 py-4 whitespace-no-wrap">
                <Link href={alert?.link ?? "#"}><p className="text-bluecustom font-bold">{alert.title}</p></Link>
                <p>{alert.description}</p>
            </td>
            <td className="px-1 py-4 whitespace-no-wrap text-right">
                <p className="whitespace-no-wrap">{dt.toLocaleDateString('en-US', {
                    month: 'short', // Use short month name (e.g., Mar)
                    day: 'numeric' // Use numeric day (e.g., 19)
                    })}</p>
                <p className="whitespace-no-wrap">{dt.toLocaleTimeString('en-US', {
                    hour: '2-digit', // Use 2-digit hour (e.g., 17)
                    minute: '2-digit' // Use 2-digit minute (e.g., 30)
                })}</p>
            </td>
          </tr>
    )
}