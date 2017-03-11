import {AlertRepository} from '../repository/alert-repository';
import {TaskRepository} from '../repository/task-repository';
import {Alert} from '../model/Alert';

export class DashboardService {
    private static instance: DashboardService;

    public constructor( private alertRepository: AlertRepository,
                        private taskRepository: TaskRepository) {}

    public static getInstance(): DashboardService {
        if (!DashboardService.instance) {
            DashboardService.instance = new DashboardService(
                AlertRepository.getInstance(),
                TaskRepository.getInstance()
            );
        }
        return DashboardService.instance;
    }

    public listAlerts(): Promise<Array<any>> {
        return this.alertRepository.listAlerts();
    }

    public dismissAlerts(alerts: Array<Alert>): Promise<any> {
        return this.alertRepository.dismissAlerts(alerts);
    }

    public dismissAlert(alert: Alert): Promise<any> {
        return this.alertRepository.dismissAlert(alert);
    }

    public dismissAllAlerts(): Promise<any> {
        return this.alertRepository.dismissAll();
    }

    public registerToTasks() {
        return this.taskRepository.registerToTasks();
    }

}
