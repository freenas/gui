import {AlertRepository} from "../repository/alert-repository";
import {TaskRepository} from "../repository/task-repository";
import * as Promise from "bluebird";

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

    public dismissAlert(alert: any): Promise<any> {
        return this.alertRepository.dismissAlert(alert);
    }

    public registerToTasks() {
        return this.taskRepository.registerToTasks();
    }

}
