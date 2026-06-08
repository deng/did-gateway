//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ChallengeResponseData {
  /// Returns a new [ChallengeResponseData] instance.
  ChallengeResponseData({
    this.nonce,
    this.message,
    this.expiresAt,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? nonce;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? message;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? expiresAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ChallengeResponseData &&
    other.nonce == nonce &&
    other.message == message &&
    other.expiresAt == expiresAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (nonce == null ? 0 : nonce!.hashCode) +
    (message == null ? 0 : message!.hashCode) +
    (expiresAt == null ? 0 : expiresAt!.hashCode);

  @override
  String toString() => 'ChallengeResponseData[nonce=$nonce, message=$message, expiresAt=$expiresAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.nonce != null) {
      json[r'nonce'] = this.nonce;
    } else {
      json[r'nonce'] = null;
    }
    if (this.message != null) {
      json[r'message'] = this.message;
    } else {
      json[r'message'] = null;
    }
    if (this.expiresAt != null) {
      json[r'expiresAt'] = this.expiresAt;
    } else {
      json[r'expiresAt'] = null;
    }
    return json;
  }

  /// Returns a new [ChallengeResponseData] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ChallengeResponseData? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ChallengeResponseData[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ChallengeResponseData[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ChallengeResponseData(
        nonce: mapValueOfType<String>(json, r'nonce'),
        message: mapValueOfType<String>(json, r'message'),
        expiresAt: mapValueOfType<int>(json, r'expiresAt'),
      );
    }
    return null;
  }

  static List<ChallengeResponseData> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChallengeResponseData>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChallengeResponseData.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChallengeResponseData> mapFromJson(dynamic json) {
    final map = <String, ChallengeResponseData>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChallengeResponseData.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ChallengeResponseData-objects as value to a dart map
  static Map<String, List<ChallengeResponseData>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ChallengeResponseData>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ChallengeResponseData.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

