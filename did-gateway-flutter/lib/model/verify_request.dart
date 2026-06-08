//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class VerifyRequest {
  /// Returns a new [VerifyRequest] instance.
  VerifyRequest({
    required this.nonce,
    required this.signature,
    required this.did,
    required this.chain,
  });

  String nonce;

  String signature;

  String did;

  String chain;

  @override
  bool operator ==(Object other) => identical(this, other) || other is VerifyRequest &&
    other.nonce == nonce &&
    other.signature == signature &&
    other.did == did &&
    other.chain == chain;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (nonce.hashCode) +
    (signature.hashCode) +
    (did.hashCode) +
    (chain.hashCode);

  @override
  String toString() => 'VerifyRequest[nonce=$nonce, signature=$signature, did=$did, chain=$chain]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'nonce'] = this.nonce;
      json[r'signature'] = this.signature;
      json[r'did'] = this.did;
      json[r'chain'] = this.chain;
    return json;
  }

  /// Returns a new [VerifyRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static VerifyRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "VerifyRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "VerifyRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return VerifyRequest(
        nonce: mapValueOfType<String>(json, r'nonce')!,
        signature: mapValueOfType<String>(json, r'signature')!,
        did: mapValueOfType<String>(json, r'did')!,
        chain: mapValueOfType<String>(json, r'chain')!,
      );
    }
    return null;
  }

  static List<VerifyRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <VerifyRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = VerifyRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, VerifyRequest> mapFromJson(dynamic json) {
    final map = <String, VerifyRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = VerifyRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of VerifyRequest-objects as value to a dart map
  static Map<String, List<VerifyRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<VerifyRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = VerifyRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'nonce',
    'signature',
    'did',
    'chain',
  };
}

