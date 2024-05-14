import { useState } from "react"

export type Alert = {
    id: string
    title: string
    status: "critical" | "normal"
    feed: string
    timestamp : string
  }
export function NotificationTab({rows}:{rows:Alert[]}){
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
      <thead>
        <tr>
          <th className="py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <input onChange={(e => {
                // if(e.target.checked){

                // } else {

                // }
            })} type="checkbox" className="form-checkbox" />
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Feed
          </th>
          <th className="px-6 py-3 text-right bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Time
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.map(alert => (
          <Row key={alert.id} alert={alert} selectedAlerts={selectedAlerts} toggleAlertSelection={toggleAlertSelection}/>
        ))}
      </tbody>
    </table>
    )
}

function Row({alert, selectedAlerts, toggleAlertSelection}:{alert:Alert; selectedAlerts:string[]; toggleAlertSelection: (alert:string)=>void}){
    const dt = new Date(alert.timestamp);
    return  (
        <tr key={alert.id}>
            <td className="py-4 whitespace-no-wrap">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedAlerts.includes(alert.id)}
                onChange={() => toggleAlertSelection(alert.id)}
              />
            </td>
            <td className="px-1 py-4 whitespace-no-wrap">
                <p className="text-bluecustom font-bold">{alert.title}</p>
                <p>{alert.feed}</p>
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