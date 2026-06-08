//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class VerificationMethod {
  /// Returns a new [VerificationMethod] instance.
  VerificationMethod({
    this.id,
    this.type,
    this.controller,
    this.publicKeyMultibase,
    this.blockchainAccountId,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? id;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? controller;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? publicKeyMultibase;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? blockchainAccountId;

  @override
  bool operator ==(Object other) => identical(this, other) || other is VerificationMethod &&
    other.id == id &&
    other.type == type &&
    other.controller == controller &&
    other.publicKeyMultibase == publicKeyMultibase &&
    other.blockchainAccountId == blockchainAccountId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (controller == null ? 0 : controller!.hashCode) +
    (publicKeyMultibase == null ? 0 : publicKeyMultibase!.hashCode) +
    (blockchainAccountId == null ? 0 : blockchainAccountId!.hashCode);

  @override
  String toString() => 'VerificationMethod[id=$id, type=$type, controller=$controller, publicKeyMultibase=$publicKeyMultibase, blockchainAccountId=$blockchainAccountId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.controller != null) {
      json[r'controller'] = this.controller;
    } else {
      json[r'controller'] = null;
    }
    if (this.publicKeyMultibase != null) {
      json[r'publicKeyMultibase'] = this.publicKeyMultibase;
    } else {
      json[r'publicKeyMultibase'] = null;
    }
    if (this.blockchainAccountId != null) {
      json[r'blockchainAccountId'] = this.blockchainAccountId;
    } else {
      json[r'blockchainAccountId'] = null;
    }
    return json;
  }

  /// Returns a new [VerificationMethod] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static VerificationMethod? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "VerificationMethod[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "VerificationMethod[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return VerificationMethod(
        id: mapValueOfType<String>(json, r'id'),
        type: mapValueOfType<String>(json, r'type'),
        controller: mapValueOfType<String>(json, r'controller'),
        publicKeyMultibase: mapValueOfType<String>(json, r'publicKeyMultibase'),
        blockchainAccountId: mapValueOfType<String>(json, r'blockchainAccountId'),
      );
    }
    return null;
  }

  static List<VerificationMethod> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <VerificationMethod>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = VerificationMethod.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, VerificationMethod> mapFromJson(dynamic json) {
    final map = <String, VerificationMethod>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = VerificationMethod.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of VerificationMethod-objects as value to a dart map
  static Map<String, List<VerificationMethod>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<VerificationMethod>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = VerificationMethod.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

