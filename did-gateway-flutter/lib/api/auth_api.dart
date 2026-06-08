//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class AuthApi {
  AuthApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Generate authentication challenge (CAIP-122 / EIP-4361)
  ///
  /// Generates a nonce and a structured sign-in message. The client signs this message with their blockchain private key.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [ChallengeRequest] challengeRequest (required):
  Future<Response> apiV1AuthChallengePostWithHttpInfo(ChallengeRequest challengeRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/auth/challenge';

    // ignore: prefer_final_locals
    Object? postBody = challengeRequest;

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

  /// Generate authentication challenge (CAIP-122 / EIP-4361)
  ///
  /// Generates a nonce and a structured sign-in message. The client signs this message with their blockchain private key.
  ///
  /// Parameters:
  ///
  /// * [ChallengeRequest] challengeRequest (required):
  Future<ChallengeResponse?> apiV1AuthChallengePost(ChallengeRequest challengeRequest,) async {
    final response = await apiV1AuthChallengePostWithHttpInfo(challengeRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ChallengeResponse',) as ChallengeResponse;
    
    }
    return null;
  }

  /// Refresh JWT token
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [TokenRequest] tokenRequest (required):
  Future<Response> apiV1AuthRefreshPostWithHttpInfo(TokenRequest tokenRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/auth/refresh';

    // ignore: prefer_final_locals
    Object? postBody = tokenRequest;

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

  /// Refresh JWT token
  ///
  /// Parameters:
  ///
  /// * [TokenRequest] tokenRequest (required):
  Future<VerifyResponse?> apiV1AuthRefreshPost(TokenRequest tokenRequest,) async {
    final response = await apiV1AuthRefreshPostWithHttpInfo(tokenRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'VerifyResponse',) as VerifyResponse;
    
    }
    return null;
  }

  /// Revoke JWT token
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [TokenRequest] tokenRequest (required):
  Future<Response> apiV1AuthRevokePostWithHttpInfo(TokenRequest tokenRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/auth/revoke';

    // ignore: prefer_final_locals
    Object? postBody = tokenRequest;

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

  /// Revoke JWT token
  ///
  /// Parameters:
  ///
  /// * [TokenRequest] tokenRequest (required):
  Future<void> apiV1AuthRevokePost(TokenRequest tokenRequest,) async {
    final response = await apiV1AuthRevokePostWithHttpInfo(tokenRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Verify signature and issue JWT
  ///
  /// Validates the nonce, resolves the DID to get the verification method, verifies the cryptographic signature (EIP-191 for EVM, Ed25519 for Solana), and issues a JWT session token.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [VerifyRequest] verifyRequest (required):
  Future<Response> apiV1AuthVerifyPostWithHttpInfo(VerifyRequest verifyRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/auth/verify';

    // ignore: prefer_final_locals
    Object? postBody = verifyRequest;

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

  /// Verify signature and issue JWT
  ///
  /// Validates the nonce, resolves the DID to get the verification method, verifies the cryptographic signature (EIP-191 for EVM, Ed25519 for Solana), and issues a JWT session token.
  ///
  /// Parameters:
  ///
  /// * [VerifyRequest] verifyRequest (required):
  Future<VerifyResponse?> apiV1AuthVerifyPost(VerifyRequest verifyRequest,) async {
    final response = await apiV1AuthVerifyPostWithHttpInfo(verifyRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'VerifyResponse',) as VerifyResponse;
    
    }
    return null;
  }
}
