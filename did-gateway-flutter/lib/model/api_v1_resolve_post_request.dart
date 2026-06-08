//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ApiV1ResolvePostRequest {
  /// Returns a new [ApiV1ResolvePostRequest] instance.
  ApiV1ResolvePostRequest({
    this.dids = const [],
  });

  List<String> dids;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ApiV1ResolvePostRequest &&
    _deepEquality.equals(other.dids, dids);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (dids.hashCode);

  @override
  String toString() => 'ApiV1ResolvePostRequest[dids=$dids]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'dids'] = this.dids;
    return json;
  }

  /// Returns a new [ApiV1ResolvePostRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ApiV1ResolvePostRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ApiV1ResolvePostRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ApiV1ResolvePostRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ApiV1ResolvePostRequest(
        dids: json[r'dids'] is Iterable
            ? (json[r'dids'] as Iterable).cast<String>().toList(growable: false)
            : const [],
      );
    }
    return null;
  }

  static List<ApiV1ResolvePostRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiV1ResolvePostRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiV1ResolvePostRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiV1ResolvePostRequest> mapFromJson(dynamic json) {
    final map = <String, ApiV1ResolvePostRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiV1ResolvePostRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ApiV1ResolvePostRequest-objects as value to a dart map
  static Map<String, List<ApiV1ResolvePostRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ApiV1ResolvePostRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ApiV1ResolvePostRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'dids',
  };
}

