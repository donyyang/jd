DatasourceStore = {


	tableStruct: {
		"data": {
			"uuid": "6a16f869-c788-4809-a262-d4e44034e6f2",
			"version": "1.5.1",
			"name": "PARTITION_TEST",
			"database": "YSMTEST",
			"columns": [{
				"id": "1",
				"name": "MEMBER_ID",
				"datatype": "varchar(256)"
			}, {
				"id": "2",
				"name": "NAME",
				"datatype": "varchar(256)"
			}, {
				"id": "3",
				"name": "STAT_DATE",
				"datatype": "varchar(256)"
			}, {
				"id": "4",
				"name": "PROVINCE",
				"datatype": "varchar(256)"
			}, {
				"id": "4",
				"name": "PROVINCE222",
				"datatype": "int"
			}, {
				"id": "4",
				"name": "PROVINCE333",
				"datatype": "bigint"
			}],
			"partitionKeys": [
				"STAT_DATE",
				"PROVINCE"
			]
		},
		"success": true
	},


	tableStruct2: {
		"data": {
			"uuid": "6a16f869-c788-4809-a262-d4e44034e6f2",
			"version": "1.5.1",
			"name": "PARTITION_TEST",
			"database": "YSMTEST",
			"columns": [{
				"id": "1",
				"name": "MEMBER_ID2222",
				"datatype": "varchar(256)"
			}, {
				"id": "2",
				"name": "NAME",
				"datatype": "varchar(256)"
			}, {
				"id": "3",
				"name": "STAT_DATE2",
				"datatype": "varchar(256)2"
			}, {
				"id": "4",
				"name": "PROVINCE2",
				"datatype": "varchar(256)2"
			}],
			"partitionKeys": [
				"STAT_DATE",
				"PROVINCE"
			]
		},
		"success": true
	},


	jiegou: {
		"data": [
			[
				"a",
				"BIGINT"
			],
			[
				"b",
				"LONGNVARCHAR"
			],
			[
				"c",
				"LONGNVARCHAR"
			]
		],
		"success": true
	},

	data10: {
		"metadata": [
			["a00"],
			["b"],
			["c"]
		],

		"data": [
			[
				null,
				"Name",
				null
			],
			[
				"1",
				"NameValueScample01",
				null
			],
			[
				"2",
				"NameValueScample02",
				null
			],
		],
		"success": true
	},



	dblist: jQuery.parseJSON('["aaa111","abc","banana","cloth","cloth2","datafunwei","datajingdo_m_","datajingdo_m_1","datajingdo_m_2","datajingdo_m_haima","datajingdo_m_hyz","datajingdo_m_lqq","datajingdo_m_recommend","datajingdo_m_test","datajingdo_m_test02","datajingdo_m_test100","datajingdo_m_xh_01","datajingong_m_defaul","dcloud_colleges","dcs_demo","demo","demo2","demo5","dim","ecc","fac","fisher_demo","game_re","guixiaowen2","inspection","jadacc","jcloud_tfc","jd_test","jingdong_test","jttest1","jttest2","ldf_whl_sales","liubinbin","liuyulong9_deafults","logdb","lyp3","lyp_1","lyp_2","lyp__db1","lyp__db131328","lyp__db360411","lyp__db384150","lyp__db607962","lyp__db924015","lyp__db999999","lyp_abcd","lyp_db1_djd","lyp_db2_djd","mingzhiwei","mrd","my_health","mydb","myname_m_10","myu","new","pipeline","q1","qwe","rtd6670130_m_test","ruc","sales_order","school","test01","test_135","test_db","testdata_js","testdb1","testdb1_lihefei","testdb2_lihefei","testdb_001","testdb_2","testdb_3","tmp","tpcds_bin_partitioned_orc_10","tpcds_text_10","tyz","vvee","whl1","wq","wqqw","wwdxet_happy","wxlink_jd","wxy","yangyang19910826_aaa","ysmtest","ysmtest2","ysmtest3","yuzt_db_1"]'),
	tablelistALL:


	{

		data: [{
				"tableName": "table0000000000000000",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a2",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a13333",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a14444",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a15555",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a1666",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a17777",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a18888",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a19999",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a100000",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			},

		]
	},

	tablelistUNLINK:


	{

		data: [{
				"tableName": "table111111111",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a2",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a13333",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a14444",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a15555",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a1666",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a17777",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a18888",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a19999",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a100000",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			},

		]
	}

	,
	tablelistLINKED:


	{

		data: [{
				"tableName": "table22222222222222",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a2",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a13333",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a14444",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a15555",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a1666",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a17777",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			}, {
				"tableName": "a18888",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a19999",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "LINKED"
			}, {
				"tableName": "a100000",
				"dbName": "aaa",
				"mask": 16,
				"tableType": "UNLINK"
			},

		]
	}

}