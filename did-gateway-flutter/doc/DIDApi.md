# did_gateway.api.DIDApi

## Load the API package
```dart
import 'package:did_gateway/api.dart';
```

All URIs are relative to *https://did.bithub.pro*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiV1MethodsGet**](DIDApi.md#apiv1methodsget) | **GET** /api/v1/methods | List supported DID methods
[**apiV1ResolveByAddressCaip10Get**](DIDApi.md#apiv1resolvebyaddresscaip10get) | **GET** /api/v1/resolve-by-address/{caip10} | Resolve CAIP-10 address to did:pkh
[**apiV1ResolveDidGet**](DIDApi.md#apiv1resolvedidget) | **GET** /api/v1/resolve/{did} | Resolve DID to DID Document
[**apiV1ResolvePost**](DIDApi.md#apiv1resolvepost) | **POST** /api/v1/resolve | Batch resolve DIDs


# **apiV1MethodsGet**
> MethodsResponse apiV1MethodsGet()

List supported DID methods

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = DIDApi();

try {
    final result = api_instance.apiV1MethodsGet();
    print(result);
} catch (e) {
    print('Exception when calling DIDApi->apiV1MethodsGet: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**MethodsResponse**](MethodsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1ResolveByAddressCaip10Get**
> apiV1ResolveByAddressCaip10Get(caip10)

Resolve CAIP-10 address to did:pkh

Convenience endpoint: converts a CAIP-10 address to a did:pkh DID Document.

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = DIDApi();
final caip10 = eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a; // String | 

try {
    api_instance.apiV1ResolveByAddressCaip10Get(caip10);
} catch (e) {
    print('Exception when calling DIDApi->apiV1ResolveByAddressCaip10Get: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **caip10** | **String**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1ResolveDidGet**
> ResolveResponse apiV1ResolveDidGet(did)

Resolve DID to DID Document

Resolves a DID (e.g. did:pkh:eip155:1:0x...) to its W3C DID Document.

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = DIDApi();
final did = did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a; // String | 

try {
    final result = api_instance.apiV1ResolveDidGet(did);
    print(result);
} catch (e) {
    print('Exception when calling DIDApi->apiV1ResolveDidGet: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **did** | **String**|  | 

### Return type

[**ResolveResponse**](ResolveResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1ResolvePost**
> ApiV1ResolvePost200Response apiV1ResolvePost(apiV1ResolvePostRequest)

Batch resolve DIDs

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = DIDApi();
final apiV1ResolvePostRequest = ApiV1ResolvePostRequest(); // ApiV1ResolvePostRequest | 

try {
    final result = api_instance.apiV1ResolvePost(apiV1ResolvePostRequest);
    print(result);
} catch (e) {
    print('Exception when calling DIDApi->apiV1ResolvePost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiV1ResolvePostRequest** | [**ApiV1ResolvePostRequest**](ApiV1ResolvePostRequest.md)|  | 

### Return type

[**ApiV1ResolvePost200Response**](ApiV1ResolvePost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

