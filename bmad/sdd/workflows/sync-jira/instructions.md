# Sync Jira - Jira Data Retrieval Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/sync-jira/workflow.yaml</critical>
<critical>This is a utility workflow - returns data to calling workflow</critical>

<workflow>

<step n="1" goal="Load Jira connection information">
<action>Load Jira credentials from {jira_info_path}</action>

<action>Expected .env format:
```
JIRA_API_URL=https://your-domain.atlassian.net
JIRA_API_TOKEN=your_api_token
JIRA_USER_EMAIL=your_email@domain.com
```
</action>

<check if="jira_info_path file not found">
  <action>Return error: "Jira configuration file not found at {jira_info_path}"</action>
  <action>Suggest: "Create .env file with JIRA_API_URL, JIRA_API_TOKEN, and JIRA_USER_EMAIL"</action>
</check>

<check if="credentials incomplete">
  <action>Return error: "Jira credentials incomplete. Check {jira_info_path}"</action>
</check>

<template-output>jira_credentials</template-output>
</step>

<step n="2" goal="Fetch Jira ticket">
<action>Receive {{ticket_number}} from calling workflow</action>
<action>Construct Jira API request:
- URL: {{JIRA_API_URL}}/rest/api/3/issue/{{ticket_number}}
- Auth: Basic {{JIRA_USER_EMAIL}}:{{JIRA_API_TOKEN}}
- Headers: Accept: application/json
</action>

<action>Execute HTTP GET request to Jira API</action>

<check if="request successful (200)">
  <action>Parse JSON response</action>
  <action>Extract ticket data:
    - key (ticket number)
    - summary (title)
    - description
    - status
    - priority
    - assignee
    - labels
    - custom fields (if any)
  </action>
</check>

<check if="request failed (401/403)">
  <action>Return error: "Jira authentication failed. Check API token and email in {jira_info_path}"</action>
</check>

<check if="request failed (404)">
  <action>Return error: "Jira ticket {{ticket_number}} not found"</action>
</check>

<check if="request failed (other)">
  <action>Return error: "Jira API error: {{error_message}}"</action>
</check>

<template-output>jira_ticket_data</template-output>
</step>

<step n="3" goal="Return ticket data to calling workflow">
<action>Format ticket data for return:
```
{
  "success": true,
  "ticket_number": "{{ticket_number}}",
  "title": "{{summary}}",
  "description": "{{description}}",
  "status": "{{status}}",
  "priority": "{{priority}}",
  "assignee": "{{assignee}}",
  "labels": [{{labels}}]
}
```
</action>

<action>Return formatted data to calling workflow</action>

<template-output>return_data</template-output>
</step>

</workflow>
