//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class DidDocument {
  /// Returns a new [DidDocument] instance.
  DidDocument({
    this.atContext,
    this.id,
    this.verificationMethod = const [],
    this.authentication = const [],
    this.assertionMethod = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? atContext;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? id;

  List<VerificationMethod> verificationMethod;

  List<String> authentication;

  List<String> assertionMethod;

  @override
  bool operator ==(Object other) => identical(this, other) || other is DidDocument &&
    other.atContext == atContext &&
    other.id == id &&
    _deepEquality.equals(other.verificationMethod, verificationMethod) &&
    _deepEquality.equals(other.authentication, authentication) &&
    _deepEquality.equals(other.assertionMethod, assertionMethod);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (atContext == null ? 0 : atContext!.hashCode) +
    (id == null ? 0 : id!.hashCode) +
    (verificationMethod.hashCode) +
    (authentication.hashCode) +
    (assertionMethod.hashCode);

  @override
  String toString() => 'DidDocument[atContext=$atContext, id=$id, verificationMethod=$verificationMethod, authentication=$authentication, assertionMethod=$assertionMethod]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.atContext != null) {
      json[r'@context'] = this.atContext;
    } else {
      json[r'@context'] = null;
    }
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
      json[r'verificationMethod'] = this.verificationMethod;
      json[r'authentication'] = this.authentication;
      json[r'assertionMethod'] = this.assertionMethod;
    return json;
  }

  /// Returns a new [DidDocument] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static DidDocument? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "DidDocument[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "DidDocument[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return DidDocument(
        atContext: mapValueOfType<Object>(json, r'@context'),
        id: mapValueOfType<String>(json, r'id'),
        verificationMethod: VerificationMethod.listFromJson(json[r'verificationMethod']),
        authentication: json[r'authentication'] is Iterable
            ? (json[r'authentication'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        assertionMethod: json[r'assertionMethod'] is Iterable
            ? (json[r'assertionMethod'] as Iterable).cast<String>().toList(growable: false)
            : const [],
      );
    }
    return null;
  }

  static List<DidDocument> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <DidDocument>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = DidDocument.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, DidDocument> mapFromJson(dynamic json) {
    final map = <String, DidDocument>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DidDocument.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of DidDocument-objects as value to a dart map
  static Map<String, List<DidDocument>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<DidDocument>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = DidDocument.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

