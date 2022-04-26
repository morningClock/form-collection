/*
SQLyog Ultimate v11.25 (64 bit)
MySQL - 5.7.35-log : Database - form_collection
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`form_collection` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `form_collection`;

/*Table structure for table `fc_customer` */

DROP TABLE IF EXISTS `fc_customer`;

CREATE TABLE `fc_customer` (
  `id` char(21) NOT NULL COMMENT 'id',
  `wx_name` varchar(20) DEFAULT NULL COMMENT '微信名称',
  `wx_avatar` varchar(255) DEFAULT NULL COMMENT '微信头像',
  `name` varchar(20) DEFAULT NULL COMMENT '客户姓名',
  `phone` varchar(13) DEFAULT NULL COMMENT '客户电话',
  `address` varchar(255) DEFAULT NULL COMMENT '配送地址',
  `id_card_number` varchar(20) DEFAULT NULL COMMENT '身份证号码',
  `id_card_img_front` varchar(255) DEFAULT NULL COMMENT '身份证正面图片',
  `id_card_img_back` varchar(255) DEFAULT NULL COMMENT '身份证背面图片',
  `status` tinyint(4) DEFAULT '0' COMMENT '处理状态(0未审核,1审核,2未处理,3已完成)',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `modified_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `fc_system_config` */

DROP TABLE IF EXISTS `fc_system_config`;

CREATE TABLE `fc_system_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `web_title` varchar(255) DEFAULT NULL,
  `admin_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Table structure for table `fc_user` */

DROP TABLE IF EXISTS `fc_user`;

CREATE TABLE `fc_user` (
  `id` int(21) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
