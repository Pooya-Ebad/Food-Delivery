import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfig} from "src/config/typeorm.config";
import {AuthModule} from "../auth/auth.module";
import {BasketModule} from "../basket/basket.module";
import {CategoryModule} from "../category/category.module";
import {DiscountModule} from "../discount/discount.module";
import {HttpApiModule} from "../http/http.module";
import {MenuModule} from "../menu/menu.module";
import {OrderModule} from "../order/order.module";
import {PaymentModule} from "../payment/payment.module";
import {SupplierModule} from "../supplier/supplier.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    CategoryModule,
    SupplierModule,
    MenuModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    OrderModule,
    HttpApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
