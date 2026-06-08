//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ApiV1DidsPostRequest {
  /// Returns a new [ApiV1DidsPostRequest] instance.
  ApiV1DidsPostRequest({
    required this.did,
  });

  String did;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ApiV1DidsPostRequest &&
    other.did == did;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (did.hashCode);

  @override
  String toString() => 'ApiV1DidsPostRequest[did=$did]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'did'] = this.did;
    return json;
  }

  /// Returns a new [ApiV1DidsPostRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ApiV1DidsPostRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ApiV1DidsPostRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ApiV1DidsPostRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ApiV1DidsPostRequest(
        did: mapValueOfType<String>(json, r'did')!,
      );
    }
    return null;
  }

  static List<ApiV1DidsPostRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiV1DidsPostRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiV1DidsPostRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiV1DidsPostRequest> mapFromJson(dynamic json) {
    final map = <String, ApiV1DidsPostRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiV1DidsPostRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ApiV1DidsPostRequest-objects as value to a dart map
  static Map<String, List<ApiV1DidsPostRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ApiV1DidsPostRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ApiV1DidsPostRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'did',
  };
}

