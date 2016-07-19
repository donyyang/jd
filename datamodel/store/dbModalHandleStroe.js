// 加速指数不要，表名是lookups.table，有两个就不一样的表名，维度表字段就是primary_key
var dataLists = {
	"data": [   //关联模型对象数组
    {
      "name": "kylin_sales_model",   //关联模型名称
      "description": "kylin_sales_model test case update",  //关联模型描述
      "lookups": [  //lookups属性为数组,包含被关联表信息以及关联方式 可以为空
        {
          "table": "DEFAULT.KYLIN_CAL_DT",   //选择的维表名称(格式为  数据库名.表名 大写 )
          "join": {  //事实表中的字段放在foreign_key中,维表字段放在primary_key
            "type": "inner",  //前台选择的关联方式 (inner 或 left)
            "primary_key": [
              "CAL_DT"    //维表(被关联表)的(主键)字段 字段名称大写
            ],
            "foreign_key": [
              "PART_DT"   //事实表(主表)的(外键)字段 字段名称大写
            ]
          }
        },
        {
          "table": "DEFAULT.KYLIN_CATEGORY_GROUPINGS",
          "join": {
            "type": "inner",
            "primary_key": [  //多个字段关联按照一样的顺序填充primary_key和foreign_key两个数组 字段名称大写  
              "LEAF_CATEG_ID",
              "SITE_ID"
            ],
            "foreign_key": [
              "LEAF_CATEG_ID",
              "LSTG_SITE_ID"
            ]
          }
        }
      ],
      "dimensions": [   //维度字段数组  一个表中的所有字段组成数组中的一个对象
        {
          "table": "DEFAULT.KYLIN_CAL_DT",  //被选择为维度的字段 所属表(格式为  数据库名.表名 大写 )
          "columns": [   //表中选择为维度的所有字段数组
            "WEEK_BEG_DT",   //字段的英文名称 大写
            "CAL_DT"
          ]
        },
        {
          "table": "DEFAULT.KYLIN_CATEGORY_GROUPINGS",
          "columns": [
            "USER_DEFINED_FIELD1",
            "USER_DEFINED_FIELD3",
            "UPD_DATE",
            "UPD_USER"
          ]
        },
        {
          "table": "DEFAULT.KYLIN_CATEGORY_GROUPINGS",
          "columns": [
            "META_CATEG_NAME",
            "CATEG_LVL2_NAME",
            "CATEG_LVL3_NAME"
          ]
        },
        {
          "table": "DEFAULT.KYLIN_SALES",
          "columns": [
            "LSTG_FORMAT_NAME",
            "SELLER_ID"
          ]
        }
      ],
      "metrics": [   //指标数组(此处指标不能保存名称,在前台去掉名称显示列) 字段名称大写
        "PRICE",
        "ITEM_COUNT"
      ],
      "fact_table": "DEFAULT.KYLIN_SALES",  //关联模型的事实表名称
      "partition_desc": {   //主表的分区信息
        "partition_date_column": "DEFAULT.KYLIN_SALES.PART_DT", //主表的分区字段 格式为( 数据库名.表名.字段名 大写)
        "partition_date_format": "yyyy-MM-dd"  //分区字段的数据格式 (前端下拉框中有两种yyyy-MM-dd和yyyyMMdd,默认选择yyyy-MM-dd)

      }
    },
    {
      "uuid": "b7e939b5-44ce-4ff9-9c73-597745166b5d",
      "name": "STOCKS_KEYLIN_MODEL",
      "description": "",
      "lookups": [],
      "dimensions": [
        {
          "table": "YSMTEST.STOCKS_KEYLIN",
          "columns": [
            "NAME1",
            "NAME2",
            "NAME3",
            "DATE_",
            "NAME4",
            "NAME5",
            "NAME6",
            "NAME7",
            "NAME8"
          ]
        }
      ],
      "metrics": [
        "NAME1",
        "NAME2",
        "NAME3",
        "DATE_",
        "NAME4",
        "NAME5",
        "NAME6",
        "NAME7",
        "NAME8"
      ],
      "fact_table": "YSMTEST.STOCKS_KEYLIN",
      "partition_desc": {
        "partition_date_column": null,
        "partition_date_format": "yyyy-MM-dd"
      }
    },
    {
      "uuid": "b6672e80-1b45-474c-916e-c3e01f6d3185",
      "name": "O2O_MODEL",
      "description": "",
      "lookups": [],
      "dimensions": [
        {
          "table": "O2O.STORE",
          "columns": [
            "STORE_ID",
            "STORE_TYPE",
            "REGION_ID",
            "STORE_NAME",
            "STORE_CITY"
          ]
        }
      ],
      "metrics": [
        "STORE_NUMBER",
        "VIDEO_STORE"
      ],
      "fact_table": "O2O.STORE",
      "partition_desc": {
        "partition_date_column": null,
        "partition_date_format": "yyyy-MM-dd"
      }
    },
    {
      "uuid": "fedd1cb5-5cf4-4bfc-8f39-ab0f9ba118c5",
      "name": "poc1",
      "description": "",
      "lookups": [
        {
          "table": "DEFAULT.KYLIN_CATEGORY_GROUPINGS",
          "join": {
            "type": "inner",
            "primary_key": [
              "LEAF_CATEG_ID",
              "SITE_ID"
            ],
            "foreign_key": [
              "LEAF_CATEG_ID",
              "LSTG_SITE_ID"
            ]
          }
        }
      ],
      "dimensions": [
        {
          "table": "DEFAULT.KYLIN_SALES",
          "columns": [
            "TRANS_ID",
            "LSTG_FORMAT_NAME",
            "PART_DT",
            "LEAF_CATEG_ID",
            "LSTG_SITE_ID",
            "SLR_SEGMENT_CD",
            "SELLER_ID"
          ]
        },
        {
          "table": "DEFAULT.KYLIN_CATEGORY_GROUPINGS",
          "columns": [
            "LEAF_CATEG_NAME",
            "CATEG_LVL2_NAME",
            "CATEG_LVL4_NAME",
            "CATEG_LVL3_NAME",
            "CATEG_LVL5_NAME",
            "CATEG_LVL6_NAME",
            "CATEG_LVL7_NAME",
            "LEAF_CATEG_ID",
            "SITE_ID"
          ]
        }
      ],
      "metrics": [
        "PRICE",
        "ITEM_COUNT",
        "TRANS_ID",
        "PART_DT",
        "LSTG_FORMAT_NAME",
        "LEAF_CATEG_ID",
        "LSTG_SITE_ID",
        "SLR_SEGMENT_CD",
        "SELLER_ID"
      ],
      "fact_table": "DEFAULT.KYLIN_SALES",
      "partition_desc": {
        "partition_date_column": null,
        "partition_date_format": "yyyy-MM-dd"
      }
    },
    {
      "uuid": "b37eb12c-9243-47ba-b8df-a97ae4ba7cde",
      "name": "123123123",
      "description": "",
      "lookups": [
        {
          "table": "DEFAULT.KYLIN_CATEGORY_GROUPINGS",
          "join": {
            "type": "inner",
            "primary_key": [
              "SITE_ID",
              "LEAF_CATEG_ID"
            ],
            "foreign_key": [
              "LSTG_SITE_ID",
              "LEAF_CATEG_ID"
            ]
          }
        }
      ],
      "dimensions": [
        {
          "table": "DEFAULT.KYLIN_SALES",
          "columns": [
            "LEAF_CATEG_ID",
            "LSTG_SITE_ID"
          ]
        },
        {
          "table": "DEFAULT.KYLIN_CATEGORY_GROUPINGS",
          "columns": [
            "LEAF_CATEG_ID",
            "LEAF_CATEG_NAME",
            "SITE_ID"
          ]
        }
      ],
      "metrics": [
        "PRICE",
        "ITEM_COUNT"
      ],
      "fact_table": "DEFAULT.KYLIN_SALES",
      "partition_desc": {
        "partition_date_column": null,
        "partition_date_format": "yyyy-MM-dd"
      }
    }
  ]
}