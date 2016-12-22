export class TopologyService {
    private static instance: TopologyService;

    private constructor() {}

    public static getInstance() {
        if (!TopologyService.instance) {
            TopologyService.instance = new TopologyService();
        }
        return TopologyService.instance;
    }

    public generateTopology(disks: Array<Object>, constraints: Object) {

    }
}
