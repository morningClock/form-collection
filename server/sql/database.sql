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
  `id_card_number` varchar(20) DEFAULT NULL COMMENT '身份证号码',
  `id_card_img_front` varchar(255) DEFAULT NULL COMMENT '身份证正面图片',
  `id_card_img_back` varchar(255) DEFAULT NULL COMMENT '身份证背面图片',
  `status` tinyint(4) DEFAULT '0' COMMENT '处理状态(0未审核,1审核,2未处理,3已完成)',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `modified_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `fc_customer` */

insert  into `fc_customer`(`id`,`wx_name`,`wx_avatar`,`name`,`phone`,`id_card_number`,`id_card_img_front`,`id_card_img_back`,`status`,`remark`,`create_time`,`modified_time`) values ('iQVaVxKzymZg3r9dNMuIc','helloworld',NULL,'广州仓库','13232130933','4452231996142360917','/uploads/jkym8ylWfqBYGOzhZEZ5e.png','/uploads/TXl2YKv7lgcbwXUFACxOj.png',1,'','2022-04-23 22:08:54','2022-04-24 19:34:25'),('S41O2sikndsdO8RwjWdqN','1231231',NULL,'哈哈','13232130933','445333199610260917','/uploads/f4XH5W37a1Y0FBtUckay9.png','/uploads/UzUqdHY3joGgcxmv_Q2-X.jpg',1,'','2022-04-23 01:19:40','2022-04-24 23:25:52'),('sVVnPLTbLuFbRXSTvm3Nw','123123',NULL,'123123','123123','123123','/uploads/NQ113Rg11WhTaCkl5GI_W.jpg','/uploads/Q_GtjoLGPa52du7QWxWbw.jpg',1,'','2022-04-23 01:23:55','2022-04-24 19:35:02');

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

/*Data for the table `fc_user` */

insert  into `fc_user`(`id`,`username`,`password`,`create_time`,`modified_time`) values (1,'admin','f4a90d7ad9a35e5a8c220019ecc163a2','2022-04-20 19:28:12','2022-04-20 19:28:12'),(2,'admin11',NULL,NULL,NULL),(3,'admin1',NULL,NULL,NULL),(4,'admin2',NULL,NULL,NULL),(5,'admin3',NULL,NULL,NULL),(6,'admin4',NULL,NULL,NULL),(7,'admin5',NULL,NULL,NULL),(8,'admin6',NULL,NULL,NULL),(9,'admin7',NULL,NULL,NULL),(10,'admin8',NULL,NULL,NULL),(11,'admin9',NULL,NULL,NULL),(12,'admin10',NULL,NULL,NULL),(13,'huang','f0f658727e7856676fc739ef276ed682','2022-04-25 18:02:00','2022-04-25 18:02:00'),(14,'huang11','f4a90d7ad9a35e5a8c220019ecc163a2','2022-04-25 18:06:11','2022-04-25 18:06:11'),(15,'huang123456','f0f658727e7856676fc739ef276ed682','2022-04-25 18:06:54','2022-04-25 18:06:54');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
