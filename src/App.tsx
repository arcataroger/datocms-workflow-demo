import {KanbanComponent, ColumnsDirective, ColumnDirective} from "@syncfusion/ej2-react-kanban";
import './App.css';
import {registerLicense} from '@syncfusion/ej2-base'
import {buildClient} from "@datocms/cma-client-browser";
import {Workflow, Item} from "@datocms/cma-client/dist/types/generated/SimpleSchemaTypes";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'


function App() {
    registerLicense(import.meta.env.VITE_LICENSE_KEY);
    const queryClient = useQueryClient();
    const datoClient = buildClient({apiToken: import.meta.env.VITE_OWNER_TOKEN});
    const workflowId = 'Kq5bp4ZFQQC-COCo13qhMQ'
    const workflowsQuery = useQuery({
        queryKey: [workflowId],
        queryFn: async () => await datoClient.workflows.find(workflowId)
    })

    const featuresQuery = useQuery({
        queryKey: ['feature'],
        queryFn: async () => await datoClient.items.list({
            filter: {
                type: 'feature'
            }
        }),
        refetchInterval: 1000
    })

    const featureMutator = useMutation({
        mutationFn: async (feature: Item) => {
            let featureWithoutStage = feature
            featureWithoutStage.meta.stage = featureWithoutStage.stage
            delete featureWithoutStage.stage
            await datoClient.items.update(feature.id, featureWithoutStage)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['feature'] })
        },
    })

    return (
        <div className="App">
            <h1>DatoCMS Workflow Demo</h1>
            <KanbanComponent id="kanban" keyField="stage" dragStop={feature => featureMutator.mutate(feature.data[0])} dataSource={featuresQuery?.data?.map((feature) => ({
                ...feature,
                stage: feature.meta?.stage
            }))}
                             cardSettings={{contentField: "description", headerField: "name"}}>
                <ColumnsDirective>
                    {workflowsQuery?.data?.stages?.map(stage => <ColumnDirective headerText={stage.name} keyField={stage.id} />)}
                </ColumnsDirective>
            </KanbanComponent>

            <h3>Workflow</h3>
            <pre>
                {JSON.stringify(workflowsQuery.data, null, 2)}
            </pre>
            <h3>Records</h3>
            <pre>
                {JSON.stringify(featuresQuery.data, null, 2)}
            </pre>

        </div>
    );
}

export default App;