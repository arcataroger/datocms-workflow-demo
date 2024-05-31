import {KanbanComponent, ColumnsDirective, ColumnDirective} from "@syncfusion/ej2-react-kanban";
import './App.css';
import {registerLicense} from '@syncfusion/ej2-base'
import {buildClient} from "@datocms/cma-client-browser";
import {Workflow, Item} from "@datocms/cma-client/dist/types/generated/SimpleSchemaTypes";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'


function App() {
    registerLicense(import.meta.env.VITE_LICENSE_KEY);
    const datoClient = buildClient({apiToken: import.meta.env.VITE_OWNER_TOKEN});
    const workflowId = 'UNbYYEdSTPyYrII6F3K6ww'
    const workflowsQuery = useQuery({
        queryKey: [workflowId],
        queryFn: async () => await datoClient.workflows.find(workflowId)
    })

    const featuresQuery = useQuery({
        queryKey: ['cAey7LErScKx4pTRFRKTkw'],
        queryFn: async () => await datoClient.items.list({
            filter: {
                type: 'feature'
            }
        })
    })


    const data = [
        {
            Id: 1,
            Status: 'Open',
            Summary: 'Analyze the new requirements gathered from the customer.',
            Type: 'Story',
            Priority: 'Low',
            Tags: 'Analyze,Customer',
            Estimate: 3.5,
            Assignee: 'Nancy Davloio',
            RankId: 1
        },
        {
            Id: 2,
            Status: 'InProgress',
            Summary: 'Fix the issues reported in the IE browser.',
            Type: 'Bug',
            Priority: 'Release Breaker',
            Tags: 'IE',
            Estimate: 2.5,
            Assignee: 'Janet Leverling',
            RankId: 2
        },
        {
            Id: 3,
            Status: 'Testing',
            Summary: 'Fix the issues reported by the customer.',
            Type: 'Bug',
            Priority: 'Low',
            Tags: 'Customer',
            Estimate: '3.5',
            Assignee: 'Steven walker',
            RankId: 1
        },
        {
            Id: 4,
            Status: 'Close',
            Summary: 'Arrange a web meeting with the customer to get the login page requirements.',
            Type: 'Others',
            Priority: 'Low',
            Tags: 'Meeting',
            Estimate: 2,
            Assignee: 'Michael Suyama',
            RankId: 1
        },
        {
            Id: 5,
            Status: 'Validate',
            Summary: 'Validate new requirements',
            Type: 'Improvement',
            Priority: 'Low',
            Tags: 'Validation',
            Estimate: 1.5,
            Assignee: 'Robert King',
            RankId: 1
        }
    ]

    return (
        <div className="App">
            <h1>DatoCMS Workflow Demo</h1>
            <KanbanComponent id="kanban" keyField="stage" dataSource={featuresQuery?.data?.map((feature) => ({...feature, stage: feature.meta?.stage}))}
                             cardSettings={{contentField: "description", headerField: "name"}}>
                <ColumnsDirective>
                    <ColumnDirective headerText="Backlog" keyField="backlog"/>
                    <ColumnDirective headerText="Todo" keyField="todo"/>
                    <ColumnDirective headerText="In Progress" keyField="in_progress"/>
                    <ColumnDirective headerText="Approved" keyField="approved"/>
                    <ColumnDirective headerText="Done" keyField="Close"/>
                </ColumnsDirective>
            </KanbanComponent>
            <pre>
                {JSON.stringify(featuresQuery.data, null, 2)}
            </pre>

        </div>
    );
}

export default App;