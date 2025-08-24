# Subscription-Based Field Visibility

This document outlines how subscription levels affect field visibility in API responses.

## Overview

Different subscription tiers have access to different fields in API responses. This document specifies which fields are available at each subscription level.

## Subscription Tiers

- **FREE**: Basic access with limited features
- **BASIC**: Access to basic job search and save features
- **PRO**: Access to company contact information and advanced search
- **PRO+**: Full access including direct employer contact and priority support

## Field Visibility by Endpoint

### 1. Job Details Endpoint

**Endpoint:** `GET /api/jobs/:id`

#### Response Fields

| Field Name           | Type   | FREE | BASIC | PRO  | PRO+ | Description                     |
|----------------------|--------|------|-------|------|------|---------------------------------|
| id                   | string | ✅   | ✅    | ✅   | ✅   | Job ID                          |
| title                | string | ✅   | ✅    | ✅   | ✅   | Job title                       |
| companyName          | string | ✅   | ✅    | ✅   | ✅   | Company name                    |
| location             | string | ✅   | ✅    | ✅   | ✅   | Job location                    |
| salary               | string | ✅   | ✅    | ✅   | ✅   | Salary range                    |
| description          | string | ✅   | ✅    | ✅   | ✅   | Job description                 |
| requirements         | array  | ✅   | ✅    | ✅   | ✅   | Job requirements                |
| benefits             | array  | ✅   | ✅    | ✅   | ✅   | Job benefits                    |
| saved                | bool   | ❌   | ✅    | ✅   | ✅   | If job is saved by user         |
| companyWebsite       | string | ❌   | ❌    | ✅   | ✅   | Company website URL             |
| hiringManagerEmail   | string | ❌   | ❌    | ❌   | ✅   | Direct hiring manager email     |
| hiringManagerPhone   | string | ❌   | ❌    | ❌   | ✅   | Direct hiring manager phone     |
| applicationStats     | object | ❌   | ❌    | ❌   | ✅   | Application statistics         |

### 2. Company Details Endpoint

**Endpoint:** `GET /api/companies/:id`

#### Response Fields

| Field Name           | Type   | FREE | BASIC | PRO  | PRO+ | Description                     |
|----------------------|--------|------|-------|------|------|---------------------------------|
| id                   | string | ✅   | ✅    | ✅   | ✅   | Company ID                      |
| name                 | string | ✅   | ✅    | ✅   | ✅   | Company name                    |
| logo                 | string | ✅   | ✅    | ✅   | ✅   | Company logo URL                |
| industry             | string | ✅   | ✅    | ✅   | ✅   | Industry sector                 |
| description          | string | ✅   | ✅    | ✅   | ✅   | Company description             |
| website              | string | ❌   | ❌    | ✅   | ✅   | Company website                 |
| email                | string | ❌   | ❌    | ❌   | ✅   | Main contact email              |
| phone                | string | ❌   | ❌    | ❌   | ✅   | Main contact phone              |
| address              | object | ❌   | ❌    | ✅   | ✅   | Company address details         |
| hiringManagers       | array  | ❌   | ❌    | ❌   | ✅   | List of hiring managers         |
| applicationStats     | object | ❌   | ❌    | ❌   | ✅   | Hiring statistics               |

## Error Responses

### Insufficient Subscription Level

When a user attempts to access a field that requires a higher subscription level:

```json
{
  "error": {
    "code": "INSUFFICIENT_SUBSCRIPTION",
    "message": "Your current subscription does not have access to this field",
    "requiredSubscription": "PRO",
    "currentSubscription": "BASIC"
  }
}
```

## Best Practices

1. **Client-Side Handling**:
   - Always check the user's subscription level before displaying fields
   - Use the `FeatureWrapper` component to handle UI elements that require specific subscription levels
   - Provide clear upgrade prompts when users attempt to access premium features

2. **Server-Side Handling**:
   - Always validate subscription levels on the server
   - Strip restricted fields from responses before sending to the client
   - Include appropriate error messages for unauthorized access attempts

## Example Implementation

### Client-Side Example

```typescript
// Check if a field is accessible
const canViewField = (fieldName: string, userSubscription: SubscriptionLevel): boolean => {
  const fieldAccess = {
    'hiringManagerEmail': 'PRO+',
    'companyWebsite': 'PRO',
    'saved': 'BASIC'
  };
  
  const requiredLevel = fieldAccess[fieldName];
  if (!requiredLevel) return true; // No restriction
  
  const subscriptionLevels = ['FREE', 'BASIC', 'PRO', 'PRO+'];
  return subscriptionLevels.indexOf(userSubscription) >= subscriptionLevels.indexOf(requiredLevel);
};
```

### Server-Side Example

```typescript
// Filter response based on subscription level
function filterResponse(data: any, subscription: string) {
  const subscriptionLevels = ['FREE', 'BASIC', 'PRO', 'PRO+'];
  const subscriptionIndex = subscriptionLevels.indexOf(subscription);
  
  return Object.entries(data).reduce((acc, [key, value]) => {
    const fieldAccess = {
      'hiringManagerEmail': 'PRO+',
      'companyWebsite': 'PRO',
      'saved': 'BASIC'
    };
    
    const requiredLevel = fieldAccess[key];
    if (!requiredLevel || subscriptionLevels.indexOf(requiredLevel) <= subscriptionIndex) {
      acc[key] = value;
    }
    
    return acc;
  }, {});
}
```

## Versioning

| Version | Date       | Description                           |
|---------|------------|---------------------------------------|
| 1.0.0   | 2025-08-23 | Initial version of the documentation  |

## Support

For questions about API access or subscription levels, please contact support@americaworking.com
