import {AlertRepository} from "../repository/alertRepository";
export class DashboardService {
    private static instance: DashboardService;

    public constructor(private alertRepository: AlertRepository) {}

    public static getInstance(): DashboardService {
        if (!DashboardService.instance) {
            DashboardService.instance = new DashboardService(
                AlertRepository.getInstance()
            );
        }
        return DashboardService.instance;
    }

    public listAlerts(): Promise<Array<any>> {
        return this.alertRepository.listAlerts();
    }

    public dismissAlert(alert: any): Promise<any> {
        return this.alertRepository.dismissAlert(alert);
    }
}
