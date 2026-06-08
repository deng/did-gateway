# did_gateway.api.AuthApi

## Load the API package
```dart
import 'package:did_gateway/api.dart';
```

All URIs are relative to *https://did.bithub.pro*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiV1AuthChallengePost**](AuthApi.md#apiv1authchallengepost) | **POST** /api/v1/auth/challenge | Generate authentication challenge (CAIP-122 / EIP-4361)
[**apiV1AuthRefreshPost**](AuthApi.md#apiv1authrefreshpost) | **POST** /api/v1/auth/refresh | Refresh JWT token
[**apiV1AuthRevokePost**](AuthApi.md#apiv1authrevokepost) | **POST** /api/v1/auth/revoke | Revoke JWT token
[**apiV1AuthVerifyPost**](AuthApi.md#apiv1authverifypost) | **POST** /api/v1/auth/verify | Verify signature and issue JWT


# **apiV1AuthChallengePost**
> ChallengeResponse apiV1AuthChallengePost(challengeRequest)

Generate authentication challenge (CAIP-122 / EIP-4361)

Generates a nonce and a structured sign-in message. The client signs this message with their blockchain private key.

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = AuthApi();
final challengeRequest = ChallengeRequest(); // ChallengeRequest | 

try {
    final result = api_instance.apiV1AuthChallengePost(challengeRequest);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->apiV1AuthChallengePost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **challengeRequest** | [**ChallengeRequest**](ChallengeRequest.md)|  | 

### Return type

[**ChallengeResponse**](ChallengeResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthRefreshPost**
> VerifyResponse apiV1AuthRefreshPost(tokenRequest)

Refresh JWT token

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = AuthApi();
final tokenRequest = TokenRequest(); // TokenRequest | 

try {
    final result = api_instance.apiV1AuthRefreshPost(tokenRequest);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->apiV1AuthRefreshPost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tokenRequest** | [**TokenRequest**](TokenRequest.md)|  | 

### Return type

[**VerifyResponse**](VerifyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthRevokePost**
> apiV1AuthRevokePost(tokenRequest)

Revoke JWT token

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = AuthApi();
final tokenRequest = TokenRequest(); // TokenRequest | 

try {
    api_instance.apiV1AuthRevokePost(tokenRequest);
} catch (e) {
    print('Exception when calling AuthApi->apiV1AuthRevokePost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tokenRequest** | [**TokenRequest**](TokenRequest.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthVerifyPost**
> VerifyResponse apiV1AuthVerifyPost(verifyRequest)

Verify signature and issue JWT

Validates the nonce, resolves the DID to get the verification method, verifies the cryptographic signature (EIP-191 for EVM, Ed25519 for Solana), and issues a JWT session token.

### Example
```dart
import 'package:did_gateway/api.dart';

final api_instance = AuthApi();
final verifyRequest = VerifyRequest(); // VerifyRequest | 

try {
    final result = api_instance.apiV1AuthVerifyPost(verifyRequest);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->apiV1AuthVerifyPost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **verifyRequest** | [**VerifyRequest**](VerifyRequest.md)|  | 

### Return type

[**VerifyResponse**](VerifyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

