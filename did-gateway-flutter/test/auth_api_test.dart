//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:did_gateway/api.dart';
import 'package:test/test.dart';


/// tests for AuthApi
void main() {
  // final instance = AuthApi();

  group('tests for AuthApi', () {
    // Generate authentication challenge (CAIP-122 / EIP-4361)
    //
    // Generates a nonce and a structured sign-in message. The client signs this message with their blockchain private key.
    //
    //Future<ChallengeResponse> apiV1AuthChallengePost(ChallengeRequest challengeRequest) async
    test('test apiV1AuthChallengePost', () async {
      // TODO
    });

    // Refresh JWT token
    //
    //Future<VerifyResponse> apiV1AuthRefreshPost(TokenRequest tokenRequest) async
    test('test apiV1AuthRefreshPost', () async {
      // TODO
    });

    // Revoke JWT token
    //
    //Future apiV1AuthRevokePost(TokenRequest tokenRequest) async
    test('test apiV1AuthRevokePost', () async {
      // TODO
    });

    // Verify signature and issue JWT
    //
    // Validates the nonce, resolves the DID to get the verification method, verifies the cryptographic signature (EIP-191 for EVM, Ed25519 for Solana), and issues a JWT session token.
    //
    //Future<VerifyResponse> apiV1AuthVerifyPost(VerifyRequest verifyRequest) async
    test('test apiV1AuthVerifyPost', () async {
      // TODO
    });

  });
}
