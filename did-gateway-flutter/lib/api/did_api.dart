//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class DIDApi {
  DIDApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// List supported DID methods
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> apiV1MethodsGetWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/methods';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List supported DID methods
  Future<MethodsResponse?> apiV1MethodsGet() async {
    final response = await apiV1MethodsGetWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'MethodsResponse',) as MethodsResponse;
    
    }
    return null;
  }

  /// Resolve CAIP-10 address to did:pkh
  ///
  /// Convenience endpoint: converts a CAIP-10 address to a did:pkh DID Document.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] caip10 (required):
  Future<Response> apiV1ResolveByAddressCaip10GetWithHttpInfo(String caip10,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/resolve-by-address/{caip10}'
      .replaceAll('{caip10}', caip10);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Resolve CAIP-10 address to did:pkh
  ///
  /// Convenience endpoint: converts a CAIP-10 address to a did:pkh DID Document.
  ///
  /// Parameters:
  ///
  /// * [String] caip10 (required):
  Future<void> apiV1ResolveByAddressCaip10Get(String caip10,) async {
    final response = await apiV1ResolveByAddressCaip10GetWithHttpInfo(caip10,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Resolve DID to DID Document
  ///
  /// Resolves a DID (e.g. did:pkh:eip155:1:0x...) to its W3C DID Document.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] did (required):
  Future<Response> apiV1ResolveDidGetWithHttpInfo(String did,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/resolve/{did}'
      .replaceAll('{did}', did);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Resolve DID to DID Document
  ///
  /// Resolves a DID (e.g. did:pkh:eip155:1:0x...) to its W3C DID Document.
  ///
  /// Parameters:
  ///
  /// * [String] did (required):
  Future<ResolveResponse?> apiV1ResolveDidGet(String did,) async {
    final response = await apiV1ResolveDidGetWithHttpInfo(did,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ResolveResponse',) as ResolveResponse;
    
    }
    return null;
  }

  /// Batch resolve DIDs
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [ApiV1ResolvePostRequest] apiV1ResolvePostRequest (required):
  Future<Response> apiV1ResolvePostWithHttpInfo(ApiV1ResolvePostRequest apiV1ResolvePostRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/resolve';

    // ignore: prefer_final_locals
    Object? postBody = apiV1ResolvePostRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Batch resolve DIDs
  ///
  /// Parameters:
  ///
  /// * [ApiV1ResolvePostRequest] apiV1ResolvePostRequest (required):
  Future<ApiV1ResolvePost200Response?> apiV1ResolvePost(ApiV1ResolvePostRequest apiV1ResolvePostRequest,) async {
    final response = await apiV1ResolvePostWithHttpInfo(apiV1ResolvePostRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ApiV1ResolvePost200Response',) as ApiV1ResolvePost200Response;
    
    }
    return null;
  }
}
