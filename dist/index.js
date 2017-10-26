'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request-promise-native'),
    queryString = require('querystring');

var ERROR = {
  MISSING_ID: {
    code: 'missing_id',
    message: 'Missing `id` parameter'
  },
  MISSING_BODY: {
    code: 'missing_body',
    message: 'Missing a proper `body` parameter'
  }
};

var handleError = function handleError(err) {
  return new Promise(function (resolve, reject) {
    return reject(err);
  });
};

var Shopware = function () {
  function Shopware(options) {
    _classCallCheck(this, Shopware);

    if (!options) {
      console.error('No host, user or api key found.');
    }

    this.host = options.host;
    this.user = options.user;
    this.apiKey = options.apiKey;

    this.request = request.defaults({
      baseUrl: this.host + '/api/',
      timeout: 30000,
      json: true,
      headers: {
        'User-Agent': 'Shopware API Client',
        'Content-Type': 'application/json; charset=utf-8'
      },
      auth: {
        user: this.user,
        pass: this.apiKey,
        sendImmediately: false
      }
    });
  }

  _createClass(Shopware, [{
    key: '_buildQueryString',
    value: function _buildQueryString(queryArray) {
      var resultString = '';
      for (var queryPartName in queryArray) {
        if (queryArray.hasOwnProperty(queryPartName)) {
          var queryPartValues = queryArray[queryPartName];
          switch (queryPartName) {
            case 'filter':
              queryPartValues.forEach(function (queryPartValue, queryPartIndex) {
                var queryResPrefix = queryPartName + '[' + queryPartIndex + ']';
                for (var queryPartValueKey in queryPartValue) {
                  if (queryPartValue.hasOwnProperty(queryPartValueKey)) {
                    resultString += resultString === '' ? '' : '&';
                    resultString += queryResPrefix + '[' + queryPartValueKey + ']=' + queryString.escape(queryPartValue[queryPartValueKey]);
                  }
                }
              });
              break;
            default:

          }
        }
      }
      return resultString;
    }
  }, {
    key: 'handleRequest',
    value: function handleRequest(config, selector) {
      var _this = this;

      if (config.qs) {
        config.url = config.url + '?' + this._buildQueryString(config.qs);
      }
      return new Promise(function (resolve, reject) {
        _this.request(config).then(function (res) {
          var responseData = selector ? res[selector] : res;
          resolve(responseData);
        }).catch(function (err) {
          reject(err.message);
        });
      });
    }
  }, {
    key: 'version',
    value: function version() {
      return this.handleRequest({
        url: 'version/',
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'getArticles',
    value: function getArticles(params) {
      return this.handleRequest({
        url: 'articles/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getArticle',
    value: function getArticle(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'articles/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'deleteArticle',
    value: function deleteArticle(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'articles/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteArticles',
    value: function deleteArticles(ids) {
      if (!ids) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'articles/',
        method: 'DELETE',
        ids: ids
      });
    }
  }, {
    key: 'createArticle',
    value: function createArticle(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'articles/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateArticle',
    value: function updateArticle(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'articles/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'updateArticles',
    value: function updateArticles(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'articles/',
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'getCategories',
    value: function getCategories(params) {
      return this.handleRequest({
        url: 'categories/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCategory',
    value: function getCategory(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'categories/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCategory',
    value: function createCategory(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'categories/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCategory',
    value: function updateCategory(id, body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'categories/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCategory',
    value: function deleteCategory(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'categories/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getVariants',
    value: function getVariants(params) {
      return this.handleRequest({
        url: 'variants/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getVariant',
    value: function getVariant(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'updateVariant',
    value: function updateVariant(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'createVariant',
    value: function createVariant(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'deleteVariant',
    value: function deleteVariant(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'variants/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteVariants',
    value: function deleteVariants(ids) {
      if (!ids) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'variants/',
        method: 'DELETE',
        ids: ids
      });
    }
  }, {
    key: 'generateArticleImages',
    value: function generateArticleImages(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'generateArticleImages/' + id,
        method: 'PUT'
      });
    }
  }, {
    key: 'listMedia',
    value: function listMedia(params) {
      return this.handleRequest({
        url: 'media/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getMedia',
    value: function getMedia(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'media/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createMedia',
    value: function createMedia(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'media/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'deleteMedia',
    value: function deleteMedia(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'media/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getOrders',
    value: function getOrders(params) {
      return this.handleRequest({
        url: 'orders/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getOrder',
    value: function getOrder(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'orders/' + id,
        method: 'GET'
      });
    }
  }, {
    key: 'updateOrder',
    value: function updateOrder(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'orders/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'getAddresses',
    value: function getAddresses(params) {
      return this.handleRequest({
        url: 'addresses/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'createAddress',
    value: function createAddress(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'addresses/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateAddress',
    value: function updateAddress(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'addresses/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteAddress',
    value: function deleteAddress(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'addresses/' + id,
        method: 'DELETE'
      }, 'data');
    }
  }, {
    key: 'getCustomers',
    value: function getCustomers(params) {
      return this.handleRequest({
        url: 'customers/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCustomer',
    value: function getCustomer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customers/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCustomer',
    value: function createCustomer(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customers/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCustomer',
    value: function updateCustomer(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customers/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCustomer',
    value: function deleteCustomer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customers/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getCaches',
    value: function getCaches(params) {
      return this.handleRequest({
        url: 'caches/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCache',
    value: function getCache(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'caches/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'deleteCache',
    value: function deleteCache(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'caches/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'deleteCaches',
    value: function deleteCaches() {
      return this.handleRequest({
        url: 'caches/',
        method: 'DELETE'
      });
    }
  }, {
    key: 'getCountries',
    value: function getCountries(params) {
      return this.handleRequest({
        url: 'countries/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCountry',
    value: function getCountry(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'countries/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCountry',
    value: function createCountry(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'countries/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCountry',
    value: function updateCountry(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'countries/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCountry',
    value: function deleteCountry(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'countries/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getCustomerGroups',
    value: function getCustomerGroups(params) {
      return this.handleRequest({
        url: 'customerGroups/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getCustomerGroup',
    value: function getCustomerGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customerGroups/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createCustomerGroup',
    value: function createCustomerGroup(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customerGroups/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateCustomerGroup',
    value: function updateCustomerGroup(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'customerGroups/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteCustomerGroup',
    value: function deleteCustomerGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'customerGroups/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getManufacturers',
    value: function getManufacturers(params) {
      return this.handleRequest({
        url: 'manufacturers/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getManufacturer',
    value: function getManufacturer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'manufacturers/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createManufacturer',
    value: function createManufacturer(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'manufacturers/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateManufacturer',
    value: function updateManufacturer(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'manufacturers/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteManufacturer',
    value: function deleteManufacturer(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'manufacturers/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getPropertyGroups',
    value: function getPropertyGroups(params) {
      return this.handleRequest({
        url: 'propertyGroups/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getPropertyGroup',
    value: function getPropertyGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'propertyGroups/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createPropertyGroup',
    value: function createPropertyGroup(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'propertyGroups/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updatePropertyGroup',
    value: function updatePropertyGroup(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'propertyGroups/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deletePropertyGroup',
    value: function deletePropertyGroup(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'propertyGroups/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getShops',
    value: function getShops(params) {
      return this.handleRequest({
        url: 'shops/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getShop',
    value: function getShop(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'shops/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createShop',
    value: function createShop(body) {
      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'shops/',
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateShop',
    value: function updateShop(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'shops/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteShop',
    value: function deleteShop(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'shops/' + id,
        method: 'DELETE'
      });
    }
  }, {
    key: 'getTranslations',
    value: function getTranslations(params) {
      return this.handleRequest({
        url: 'translations/',
        method: 'GET',
        qs: params
      }, 'data');
    }
  }, {
    key: 'getTranslation',
    value: function getTranslation(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'GET'
      }, 'data');
    }
  }, {
    key: 'createTranslation',
    value: function createTranslation(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'POST',
        body: body
      });
    }
  }, {
    key: 'updateTranslation',
    value: function updateTranslation(id, body) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      if (!body) {
        return handleError(ERROR.MISSING_BODY);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'PUT',
        body: body
      });
    }
  }, {
    key: 'deleteTranslation',
    value: function deleteTranslation(id) {
      if (!id) {
        return handleError(ERROR.MISSING_ID);
      }

      return this.handleRequest({
        url: 'translations/' + id,
        method: 'DELETE'
      });
    }
  }]);

  return Shopware;
}();

module.exports = Shopware;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVlc3QiLCJyZXF1aXJlIiwicXVlcnlTdHJpbmciLCJFUlJPUiIsIk1JU1NJTkdfSUQiLCJjb2RlIiwibWVzc2FnZSIsIk1JU1NJTkdfQk9EWSIsImhhbmRsZUVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJlcnIiLCJTaG9wd2FyZSIsIm9wdGlvbnMiLCJjb25zb2xlIiwiZXJyb3IiLCJob3N0IiwidXNlciIsImFwaUtleSIsImRlZmF1bHRzIiwiYmFzZVVybCIsInRpbWVvdXQiLCJqc29uIiwiaGVhZGVycyIsImF1dGgiLCJwYXNzIiwic2VuZEltbWVkaWF0ZWx5IiwicXVlcnlBcnJheSIsInJlc3VsdFN0cmluZyIsInF1ZXJ5UGFydE5hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsInF1ZXJ5UGFydFZhbHVlcyIsImZvckVhY2giLCJxdWVyeVBhcnRWYWx1ZSIsInF1ZXJ5UGFydEluZGV4IiwicXVlcnlSZXNQcmVmaXgiLCJxdWVyeVBhcnRWYWx1ZUtleSIsImVzY2FwZSIsImNvbmZpZyIsInNlbGVjdG9yIiwicXMiLCJ1cmwiLCJfYnVpbGRRdWVyeVN0cmluZyIsInRoZW4iLCJyZXNwb25zZURhdGEiLCJyZXMiLCJjYXRjaCIsImhhbmRsZVJlcXVlc3QiLCJtZXRob2QiLCJwYXJhbXMiLCJpZCIsImlkcyIsImJvZHkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFNQSxVQUFVQyxRQUFRLHdCQUFSLENBQWhCO0FBQUEsSUFDTUMsY0FBY0QsUUFBUSxhQUFSLENBRHBCOztBQUdBLElBQU1FLFFBQVE7QUFDWkMsY0FBWTtBQUNWQyxVQUFNLFlBREk7QUFFVkMsYUFBUztBQUZDLEdBREE7QUFLWkMsZ0JBQWM7QUFDWkYsVUFBTSxjQURNO0FBRVpDLGFBQVM7QUFGRztBQUxGLENBQWQ7O0FBV0EsSUFBTUUsY0FBYyxTQUFkQSxXQUFjO0FBQUEsU0FBTyxJQUFJQyxP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QUFMLEVBQVc7QUFDVCxlQUFPN0MsWUFBWUwsTUFBTUksWUFBbEIsQ0FBUDtBQUNEOztBQUVELGFBQU8sS0FBS3lDLGFBQUwsQ0FBbUI7QUFDeEJOLCtCQUFxQlMsRUFERztBQUV4QkYsZ0JBQVEsTUFGZ0I7QUFHeEJJO0FBSHdCLE9BQW5CLENBQVA7QUFLRDs7O3NDQUVpQkYsRSxFQUFJRSxJLEVBQU07QUFDMUIsVUFBSSxDQUFDRixFQUFMLEVBQVM7QUFDUCxlQUFPM0MsWUFBWUwsTUFBTUMsVUFBbEIsQ0FBUDtBQUNEOztBQUVELFVBQUksQ0FBQ2lELElBQUwsRUFBVztBQUNULGVBQU83QyxZQUFZTCxNQUFNSSxZQUFsQixDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLeUMsYUFBTCxDQUFtQjtBQUN4Qk4sK0JBQXFCUyxFQURHO0FBRXhCRixnQkFBUSxLQUZnQjtBQUd4Qkk7QUFId0IsT0FBbkIsQ0FBUDtBQUtEOzs7c0NBRWlCRixFLEVBQUk7QUFDcEIsVUFBSSxDQUFDQSxFQUFMLEVBQVM7QUFDUCxlQUFPM0MsWUFBWUwsTUFBTUMsVUFBbEIsQ0FBUDtBQUNEOztBQUVELGFBQU8sS0FBSzRDLGFBQUwsQ0FBbUI7QUFDeEJOLCtCQUFxQlMsRUFERztBQUV4QkYsZ0JBQVE7QUFGZ0IsT0FBbkIsQ0FBUDtBQUlEOzs7Ozs7QUFJSEssT0FBT0MsT0FBUCxHQUFpQjFDLFFBQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QtcHJvbWlzZS1uYXRpdmUnKSxcbiAgICAgIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcblxuY29uc3QgRVJST1IgPSB7XG4gIE1JU1NJTkdfSUQ6IHtcbiAgICBjb2RlOiAnbWlzc2luZ19pZCcsXG4gICAgbWVzc2FnZTogJ01pc3NpbmcgYGlkYCBwYXJhbWV0ZXInXG4gIH0sXG4gIE1JU1NJTkdfQk9EWToge1xuICAgIGNvZGU6ICdtaXNzaW5nX2JvZHknLFxuICAgIG1lc3NhZ2U6ICdNaXNzaW5nIGEgcHJvcGVyIGBib2R5YCBwYXJhbWV0ZXInXG4gIH1cbn1cblxuY29uc3QgaGFuZGxlRXJyb3IgPSBlcnIgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVqZWN0KGVycikpXG5cbmNsYXNzIFNob3B3YXJlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgY29uc29sZS5lcnJvcignTm8gaG9zdCwgdXNlciBvciBhcGkga2V5IGZvdW5kLicpXG4gICAgfVxuXG4gICAgdGhpcy5ob3N0ID0gb3B0aW9ucy5ob3N0XG4gICAgdGhpcy51c2VyID0gb3B0aW9ucy51c2VyXG4gICAgdGhpcy5hcGlLZXkgPSBvcHRpb25zLmFwaUtleVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdC5kZWZhdWx0cyh7XG4gICAgICBiYXNlVXJsOiB0aGlzLmhvc3QgKyAnL2FwaS8nLFxuICAgICAgdGltZW91dDogMzAwMDAsXG4gICAgICBqc29uOiB0cnVlLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnVXNlci1BZ2VudCc6ICdTaG9wd2FyZSBBUEkgQ2xpZW50JyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgfSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VyLFxuICAgICAgICBwYXNzOiB0aGlzLmFwaUtleSxcbiAgICAgICAgc2VuZEltbWVkaWF0ZWx5OiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBfYnVpbGRRdWVyeVN0cmluZyAocXVlcnlBcnJheSkge1xuICAgIGxldCByZXN1bHRTdHJpbmcgPSAnJztcbiAgICBmb3IgKHZhciBxdWVyeVBhcnROYW1lIGluIHF1ZXJ5QXJyYXkpIHtcbiAgICAgIGlmIChxdWVyeUFycmF5Lmhhc093blByb3BlcnR5KHF1ZXJ5UGFydE5hbWUpKSB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5UGFydFZhbHVlcyA9IHF1ZXJ5QXJyYXlbcXVlcnlQYXJ0TmFtZV07XG4gICAgICAgIHN3aXRjaCAocXVlcnlQYXJ0TmFtZSkge1xuICAgICAgICAgIGNhc2UgJ2ZpbHRlcic6XG4gICAgICAgICAgICBxdWVyeVBhcnRWYWx1ZXMuZm9yRWFjaCgocXVlcnlQYXJ0VmFsdWUsIHF1ZXJ5UGFydEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHF1ZXJ5UmVzUHJlZml4ID0gcXVlcnlQYXJ0TmFtZSArICdbJyArIHF1ZXJ5UGFydEluZGV4ICsgJ10nXG4gICAgICAgICAgICAgIGZvciAodmFyIHF1ZXJ5UGFydFZhbHVlS2V5IGluIHF1ZXJ5UGFydFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXJ5UGFydFZhbHVlLmhhc093blByb3BlcnR5KHF1ZXJ5UGFydFZhbHVlS2V5KSkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0U3RyaW5nICs9IChyZXN1bHRTdHJpbmcgPT09ICcnKT8gJycgOiAnJic7XG4gICAgICAgICAgICAgICAgICByZXN1bHRTdHJpbmcgKz0gcXVlcnlSZXNQcmVmaXggKyAnWycgKyBxdWVyeVBhcnRWYWx1ZUtleSArICddPScgKyBxdWVyeVN0cmluZy5lc2NhcGUocXVlcnlQYXJ0VmFsdWVbcXVlcnlQYXJ0VmFsdWVLZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRTdHJpbmc7XG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0KGNvbmZpZywgc2VsZWN0b3IpIHtcbiAgICBpZiAoY29uZmlnLnFzKSB7XG4gICAgICBjb25maWcudXJsID0gY29uZmlnLnVybCArICc/JyArIHRoaXMuX2J1aWxkUXVlcnlTdHJpbmcoY29uZmlnLnFzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVxdWVzdChjb25maWcpXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gc2VsZWN0b3IgPyByZXNbc2VsZWN0b3JdIDogcmVzXG4gICAgICAgICAgcmVzb2x2ZShyZXNwb25zZURhdGEpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIubWVzc2FnZSlcbiAgICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3ZlcnNpb24vJyxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRBcnRpY2xlcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2FydGljbGVzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldEFydGljbGUoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGFydGljbGVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBkZWxldGVBcnRpY2xlKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBhcnRpY2xlcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZUFydGljbGVzKGlkcykge1xuICAgIGlmICghaWRzKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2FydGljbGVzLycsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgaWRzXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZUFydGljbGUoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2FydGljbGVzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQXJ0aWNsZShpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGFydGljbGVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZUFydGljbGVzKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdhcnRpY2xlcy8nLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZ2V0Q2F0ZWdvcmllcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2NhdGVnb3JpZXMvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgZ2V0Q2F0ZWdvcnkoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGNhdGVnb3JpZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGNyZWF0ZUNhdGVnb3J5KGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdjYXRlZ29yaWVzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQ2F0ZWdvcnkoaWQsIGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjYXRlZ29yaWVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZUNhdGVnb3J5KGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjYXRlZ29yaWVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0VmFyaWFudHMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICd2YXJpYW50cy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRWYXJpYW50KGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB2YXJpYW50cy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgdXBkYXRlVmFyaWFudChpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHZhcmlhbnRzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZVZhcmlhbnQoaWQsIGJvZHkpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB2YXJpYW50cy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlVmFyaWFudChpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgdmFyaWFudHMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBkZWxldGVWYXJpYW50cyhpZHMpIHtcbiAgICBpZiAoIWlkcykge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB2YXJpYW50cy9gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIGlkc1xuICAgIH0pXG4gIH1cblxuICBnZW5lcmF0ZUFydGljbGVJbWFnZXMoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGdlbmVyYXRlQXJ0aWNsZUltYWdlcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnXG4gICAgfSlcbiAgfVxuXG4gIGxpc3RNZWRpYShwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ21lZGlhLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldE1lZGlhKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBtZWRpYS8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgY3JlYXRlTWVkaWEoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ21lZGlhLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlTWVkaWEoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYG1lZGlhLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0T3JkZXJzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnb3JkZXJzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldE9yZGVyKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBvcmRlcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0pXG4gIH1cblxuICB1cGRhdGVPcmRlcihpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYG9yZGVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBnZXRBZGRyZXNzZXMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdhZGRyZXNzZXMvJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBxczogcGFyYW1zXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgY3JlYXRlQWRkcmVzcyhib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnYWRkcmVzc2VzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQWRkcmVzcyhpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGFkZHJlc3Nlcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVBZGRyZXNzKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBhZGRyZXNzZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldEN1c3RvbWVycyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2N1c3RvbWVycy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRDdXN0b21lcihpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY3VzdG9tZXJzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBjcmVhdGVDdXN0b21lcihib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY3VzdG9tZXJzLycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQ3VzdG9tZXIoaWQsIGJvZHkpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjdXN0b21lcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlQ3VzdG9tZXIoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYGN1c3RvbWVycy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGdldENhY2hlcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2NhY2hlcy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRDYWNoZShpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY2FjaGVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBkZWxldGVDYWNoZShpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY2FjaGVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlQ2FjaGVzKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY2FjaGVzLycsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGdldENvdW50cmllcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2NvdW50cmllcy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRDb3VudHJ5KGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjb3VudHJpZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGNyZWF0ZUNvdW50cnkoYm9keSkge1xuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ2NvdW50cmllcy8nLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZUNvdW50cnkoaWQsIGJvZHkpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjb3VudHJpZXMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlQ291bnRyeShpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY291bnRyaWVzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0Q3VzdG9tZXJHcm91cHMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdjdXN0b21lckdyb3Vwcy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRDdXN0b21lckdyb3VwKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBjdXN0b21lckdyb3Vwcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgY3JlYXRlQ3VzdG9tZXJHcm91cChib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnY3VzdG9tZXJHcm91cHMvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVDdXN0b21lckdyb3VwKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY3VzdG9tZXJHcm91cHMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlQ3VzdG9tZXJHcm91cChpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgY3VzdG9tZXJHcm91cHMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBnZXRNYW51ZmFjdHVyZXJzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnbWFudWZhY3R1cmVycy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRNYW51ZmFjdHVyZXIoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYG1hbnVmYWN0dXJlcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGNyZWF0ZU1hbnVmYWN0dXJlcihib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAnbWFudWZhY3R1cmVycy8nLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZU1hbnVmYWN0dXJlcihpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYG1hbnVmYWN0dXJlcnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlTWFudWZhY3R1cmVyKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBtYW51ZmFjdHVyZXJzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICB9KVxuICB9XG5cbiAgZ2V0UHJvcGVydHlHcm91cHMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdwcm9wZXJ0eUdyb3Vwcy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRQcm9wZXJ0eUdyb3VwKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBwcm9wZXJ0eUdyb3Vwcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgJ2RhdGEnKVxuICB9XG5cbiAgY3JlYXRlUHJvcGVydHlHcm91cChib2R5KSB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiAncHJvcGVydHlHcm91cHMvJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVQcm9wZXJ0eUdyb3VwKGlkLCBib2R5KSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19CT0RZKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgcHJvcGVydHlHcm91cHMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlUHJvcGVydHlHcm91cChpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgcHJvcGVydHlHcm91cHMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pXG4gIH1cblxuICBnZXRTaG9wcyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3Nob3BzLycsXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcXM6IHBhcmFtc1xuICAgIH0sICdkYXRhJylcbiAgfVxuXG4gIGdldFNob3AoaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHNob3BzLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBjcmVhdGVTaG9wKGJvZHkpIHtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6ICdzaG9wcy8nLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5XG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVNob3AoaWQsIGJvZHkpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBzaG9wcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgYm9keVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVTaG9wKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfSUQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGBzaG9wcy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG4gIGdldFRyYW5zbGF0aW9ucyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogJ3RyYW5zbGF0aW9ucy8nLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHFzOiBwYXJhbXNcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBnZXRUcmFuc2xhdGlvbihpZCkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3Qoe1xuICAgICAgdXJsOiBgdHJhbnNsYXRpb25zLyR7aWR9YCxcbiAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCAnZGF0YScpXG4gIH1cblxuICBjcmVhdGVUcmFuc2xhdGlvbihpZCwgYm9keSkge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0lEKVxuICAgIH1cblxuICAgIGlmICghYm9keSkge1xuICAgICAgcmV0dXJuIGhhbmRsZUVycm9yKEVSUk9SLk1JU1NJTkdfQk9EWSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHRyYW5zbGF0aW9ucy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlVHJhbnNsYXRpb24oaWQsIGJvZHkpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHJldHVybiBoYW5kbGVFcnJvcihFUlJPUi5NSVNTSU5HX0JPRFkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7XG4gICAgICB1cmw6IGB0cmFuc2xhdGlvbnMvJHtpZH1gLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGJvZHlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlVHJhbnNsYXRpb24oaWQpIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlRXJyb3IoRVJST1IuTUlTU0lOR19JRClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHtcbiAgICAgIHVybDogYHRyYW5zbGF0aW9ucy8ke2lkfWAsXG4gICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgfSlcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hvcHdhcmVcbiJdfQ==