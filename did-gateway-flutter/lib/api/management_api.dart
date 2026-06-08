//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class ManagementApi {
  ManagementApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Deactivate a DID
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] did (required):
  Future<Response> apiV1DidsDidDeleteWithHttpInfo(String did,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/dids/{did}'
      .replaceAll('{did}', did);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'DELETE',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Deactivate a DID
  ///
  /// Parameters:
  ///
  /// * [String] did (required):
  Future<void> apiV1DidsDidDelete(String did,) async {
    final response = await apiV1DidsDidDeleteWithHttpInfo(did,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// List DIDs by controller
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] controller:
  Future<Response> apiV1DidsGetWithHttpInfo({ String? controller, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/dids';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (controller != null) {
      queryParams.addAll(_queryParams('', 'controller', controller));
    }

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

  /// List DIDs by controller
  ///
  /// Parameters:
  ///
  /// * [String] controller:
  Future<void> apiV1DidsGet({ String? controller, }) async {
    final response = await apiV1DidsGetWithHttpInfo( controller: controller, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Register a new DID
  ///
  /// Requires a valid JWT (Authorization: Bearer). The authenticated user becomes the DID controller.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [ApiV1DidsPostRequest] apiV1DidsPostRequest (required):
  Future<Response> apiV1DidsPostWithHttpInfo(ApiV1DidsPostRequest apiV1DidsPostRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/dids';

    // ignore: prefer_final_locals
    Object? postBody = apiV1DidsPostRequest;

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

  /// Register a new DID
  ///
  /// Requires a valid JWT (Authorization: Bearer). The authenticated user becomes the DID controller.
  ///
  /// Parameters:
  ///
  /// * [ApiV1DidsPostRequest] apiV1DidsPostRequest (required):
  Future<void> apiV1DidsPost(ApiV1DidsPostRequest apiV1DidsPostRequest,) async {
    final response = await apiV1DidsPostWithHttpInfo(apiV1DidsPostRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }
}
