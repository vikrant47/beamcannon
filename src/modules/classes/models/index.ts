export const Models = {
    TEST_USERS: 'test_users',
    QUEUE: 'jira-workspace-queues',
    QUEUE_USERS: 'jira-workspace-queue_users',
    SKILLS: 'jira-workspace-skills',
    USER_SKILLS: 'jira-workspace-user_skills',
    USER_INBOX_ITEMS: 'jira-workspace-inbox_items',
    USER_PRESENCE: 'jira-workspace-user_presence',
    USER_PROPERTIES: 'jira-workspace-user_properties',
    INSTANCE_PROPERTIES: 'jira-workspace-instance_properties',
    BEAMMEUP_CONNECTIONS: 'beammeup_connections',
    BEAMMEUP_USERS: 'beammeup_users',
    BEAMMEUP_WS_SUBSCRIPTIONS: 'beammeup_websocket_subscriptions'
}
export const isValidModel = (model) => {
    return Object.values(Models).indexOf(model) >= 0;
}
