package com.matebuilder.common.api;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(value = "统一返回结果")
public class R<T> {
    @ApiModelProperty(value = "状态码")
    private Integer code;

    @ApiModelProperty(value = "返回消息")
    private String message;

    @ApiModelProperty(value = "返回数据")
    private T data;

    private R() {
    }

    public static <T> R<T> ok() {
        return ok(null);
    }

    public static <T> R<T> ok(T data) {
        R<T> r = new R<>();
        r.setCode(200);
        r.setMessage("操作成功");
        r.setData(data);
        return r;
    }

    public static <T> R<T> error() {
        return error(500, "操作失败");
    }

    public static <T> R<T> error(String message) {
        return error(500, message);
    }

    public static <T> R<T> error(Integer code, String message) {
        R<T> r = new R<>();
        r.setCode(code);
        r.setMessage(message);
        return r;
    }
}
