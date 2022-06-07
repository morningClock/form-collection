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

/*Table structure for table `fc_system_config` */

DROP TABLE IF EXISTS `fc_system_config`;

CREATE TABLE `fc_system_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `web_title` varchar(255) DEFAULT NULL,
  `admin_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `fc_system_config` */

insert  into `fc_system_config`(`id`,`web_title`,`admin_title`) values (1,'表单填报系统','客户信息管理系统');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
