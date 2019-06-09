// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

var exports = module.exports;

var azureutil = require("./util/util.js");

require("./util/patch-xmlbuilder.js");

var nodeVersion = azureutil.getNodeVersion();
if (nodeVersion.major === 0 && nodeVersion.minor > 8 && !(nodeVersion.minor > 10 || nodeVersion.minor === 10 && nodeVersion.patch >= 3)) {
  throw new Error('The Microsoft Azure node SDK does not work with node versions > 0.9.0 and < 0.10.3. Please upgrade to node >= 0.10.3');
}

exports.xmlbuilder = require("../../npm/xmlbuilder/lib/index.js");
exports.xml2js = require("../../npm/xml2js/lib/xml2js.js");

exports.Logger = require("./diagnostics/logger.js");
exports.WebResource = require("./http/webresource.js");

// Services
exports.StorageServiceClient = require("./services/storageserviceclient.js");

// Models
exports.ServicePropertiesResult = require("./models/servicepropertiesresult.js");
exports.ServiceStatsParser = require("./models/servicestatsparser.js");
exports.AclResult = require("./models/aclresult.js");
exports.TokenCredential = require("./models/tokencredential.js");

// Filters
exports.LinearRetryPolicyFilter = require("./filters/linearretrypolicyfilter.js");
exports.ExponentialRetryPolicyFilter = require("./filters/exponentialretrypolicyfilter.js");
exports.RetryPolicyFilter = require("./filters/retrypolicyfilter.js");

// Signing
exports.SharedAccessSignature = require("./signing/sharedaccesssignature.js");
exports.SharedKey = require("./signing/sharedkey.js");

// Streams
exports.BatchOperation = require("./streams/batchoperation.js");
exports.ChunkAllocator = require("./streams/chunkallocator.js");
exports.ChunkStream = require("./streams/chunkstream.js");
exports.ChunkStreamWithStream = require("./streams/chunkstreamwithstream.js");
exports.SpeedSummary = require("./streams/speedsummary.js");
exports.BufferStream = require("./streams/bufferstream.js");

// Utilities
exports.Constants = require("./util/constants.js");
exports.SR = require("./util/sr.js");
exports.date = require("./util/date.js");
exports.ISO8061Date = require("./util/iso8061date.js");
exports.util = require("./util/util.js");
exports.validate = require("./util/validate.js");
exports.StorageUtilities = require("./util/storageutilities.js");
exports.AccessCondition = require("./util/accesscondition.js");