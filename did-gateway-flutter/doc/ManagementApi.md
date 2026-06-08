# did_gateway.api.ManagementApi

## Load the API package
```dart
import 'package:did_gateway/api.dart';
```

All URIs are relative to *https://did.bithub.pro*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiV1DidsDidDelete**](ManagementApi.md#apiv1didsdiddelete) | **DELETE** /api/v1/dids/{did} | Deactivate a DID
[**apiV1DidsGet**](ManagementApi.md#apiv1didsget) | **GET** /api/v1/dids | List DIDs by controller
[**apiV1DidsPost**](ManagementApi.md#apiv1didspost) | **POST** /api/v1/dids | Register a new DID


# **apiV1DidsDidDelete**
> apiV1DidsDidDelete(did)

Deactivate a DID

### Example
```dart
import 'package:did_gateway/api.dart';
// TODO Configure HTTP Bearer authorization: bearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearerAuth').setAccessToken(yourTokenGeneratorFunction);

final api_instance = ManagementApi();
final did = did_example; // String | 

try {
    api_instance.apiV1DidsDidDelete(did);
} catch (e) {
    print('Exception when calling ManagementApi->apiV1DidsDidDelete: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **did** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1DidsGet**
> apiV1DidsGet(controller)

List DIDs by controller

### Example
```dart
import 'package:did_gateway/api.dart';
// TODO Configure HTTP Bearer authorization: bearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearerAuth').setAccessToken(yourTokenGeneratorFunction);

final api_instance = ManagementApi();
final controller = controller_example; // String | 

try {
    api_instance.apiV1DidsGet(controller);
} catch (e) {
    print('Exception when calling ManagementApi->apiV1DidsGet: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **controller** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1DidsPost**
> apiV1DidsPost(apiV1DidsPostRequest)

Register a new DID

Requires a valid JWT (Authorization: Bearer). The authenticated user becomes the DID controller.

### Example
```dart
import 'package:did_gateway/api.dart';
// TODO Configure HTTP Bearer authorization: bearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearerAuth').setAccessToken(yourTokenGeneratorFunction);

final api_instance = ManagementApi();
final apiV1DidsPostRequest = ApiV1DidsPostRequest(); // ApiV1DidsPostRequest | 

try {
    api_instance.apiV1DidsPost(apiV1DidsPostRequest);
} catch (e) {
    print('Exception when calling ManagementApi->apiV1DidsPost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiV1DidsPostRequest** | [**ApiV1DidsPostRequest**](ApiV1DidsPostRequest.md)|  | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

